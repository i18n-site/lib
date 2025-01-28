import { basename } from "node:path"
import snake from "@3-/snake"

export default {
	name: basename(import.meta.filename).slice(0, -3),
	enforce: "pre", // 确保在 Svelte 插件前执行
	transform(code, id) {
		if (id.endsWith(".svelte")) {
			return (
				`<svelte:options customElement={{tag:'${"i-" + snake(basename(id.slice(0, -7)))}',shadow:'none'}}/>` +
				code
			)
		}
	},
}
