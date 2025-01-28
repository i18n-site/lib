import IS_PROD from "./IS_PROD.js"
import { relative, join, basename, dirname } from "path"
import write from "@3-/write"
import extract from "@3-/extract"

const minifyJs = IS_PROD && (await import("./minifyJs.js")).default
const minifyCss = IS_PROD && (await import("./minifyCss.js")).default

export default {
	name: "svelte-post-process",
	enforce: "post",
	generateBundle: async ({ dir }, bundle) => {
		const dir_style = join(dirname(dir), "style")
		for (const [fileName, chunk] of Object.entries(bundle)) {
			if (!fileName.endsWith(".js")) continue
			let css
			const is_svelte =
				chunk.type === "chunk" &&
				chunk.facadeModuleId?.endsWith(".svelte") &&
				chunk.isEntry
			if (is_svelte) {
				chunk.code = chunk.code
					.replace(
						"append_styles($$anchor, $$css);",
						"// append_styles($$anchor, $$css);",
					)
					.replace(/\s*\w+ as append_styles,/, "")

				css = extract("const $$css = {", "function ", chunk.code)
				const no_ext_name = fileName.slice(0, -3)
				let define
				if (css) {
					css = JSON.parse(
						css.slice(css.indexOf('code: "'), css.lastIndexOf("};")).slice(6),
					).trim()

					if (IS_PROD) {
						const r = minifyCss(css)
						if (r) {
							const { code } = r
							css = code
						}
					}
					write(
						join(dir_style, fileName),
						`export default ${JSON.stringify(css)}`,
					)
					write(join(dir_style, no_ext_name + ".css"), css)
					define = "S"
				} else {
					define = "C"
				}
				chunk.code =
					`import {${define}} from 'd/_.js'\n` +
					chunk.code.replace('customElements.define("i-', define + '("')
			}

			if (fileName.startsWith("custom-element")) {
				chunk.code =
					`import {DOC,tag} from 'd/_.js'\n` +
					chunk.code
						.split("\n")
						.filter((i) => !i.trimStart().startsWith("append_styles as "))
						.join("\n")
						.replaceAll("document", "DOC")
						.replaceAll("DOC.createElement", "tag")
			}

			let outname

			const outfp = join(dir, fileName)

			if (IS_PROD) {
				const r = await minifyJs(chunk.code)
				chunk.code = r.code
				write(outfp + ".map", Buffer.from(r.map))
			}
		}
	},
}
