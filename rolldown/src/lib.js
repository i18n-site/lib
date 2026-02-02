import { rolldown } from "rolldown"
import { writeFileSync } from "node:fs"
import merge from "@3-/merge"

const CONF = {
	output: {
		minify: "dce-only",
	},
	treeshake: {
		preset: "smallest",
		unknownGlobalSideEffects: false,
		moduleSideEffects: false,
	},
}

const _minify = async (option, minify) => {
	const {
		output: [{ code }],
	} = await (await rolldown(option)).generate({
		format: "esm",
		minify,
	})
	return code
}

const autoPass = async (func, size = Infinity) => {
	const code = await func(),
		len = code.length
	if (len < size) {
		return autoPass(func, len)
	}
	return code
}

const _treeshake = (option) =>
	autoPass(async () => {
		const code = await _minify(option, false)
		writeFileSync(option.input, code)
		return code
	})

export default async (input, option, minify) => {
	option = merge(
		{
			input,
		},
		CONF,
		option || {},
	)
	const code = await _treeshake(option)
	if (minify) {
		return await autoPass(async () => {
			const code = await _minify(option, minify)
			writeFileSync(input, code)
			return code
		})
	}
	return code
}
