import svelteCustomElement from "./svelteCustomElement.js"
import { basename, dirname, join } from "path"
import { readdirSync } from "fs"
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { walkRel } from "@3-/walk"
import coffeePreprocessor from "./coffee.js"
import pug from "./pug.js"
import comJs from "./comJs.js"
import IS_DEV from "./IS_DEV.js"

const lowerCamel = (str) => str[0].toLowerCase() + str.slice(1)

export default async (src) => {
	const entry = {},
		root = dirname(src)

	for await (let rel of walkRel(src)) {
		if (rel.endsWith(".svelte")) {
			const fname = basename(rel)
			entry[rel.slice(0, -fname.length) + lowerCamel(fname.slice(0, -7))] =
				"./" + rel
		}
	}

	const compilerOptions = {
		customElement: true,
	}

	// not vite dev
	if (!IS_DEV) {
		// 禁用哈希后缀
		compilerOptions.cssHash = ({ hash, css, name, filename }) =>
			lowerCamel(name)
	}

	return {
		plugins: [
			comJs,
			svelteCustomElement,
			svelte({
				preprocess: [vitePreprocess(), coffeePreprocessor, pug],
				compilerOptions,
			}),
		],
		build: {
			outDir: join(root, "dist", src.slice(root.length + 1)),
			minify: false,
			emptyOutDir: true,
			cssMinify: false,
			rollupOptions: {
				output: {
					entryFileNames: `[name].js`,
					chunkFileNames: `[name].js`,
					assetFileNames: `[name].[ext]`,
				},
			},
			lib: {
				entry,
				fileName: (_format, entryName) => `${entryName}.js`,
				formats: ["es"],
			},
		},
	}
}
