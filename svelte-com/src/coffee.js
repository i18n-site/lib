#!/usr/bin/env bun

import hack from "@3-/coffee_plus"
import coffeescript from "coffeescript"

const compile = hack(coffeescript)

export default {
	script: ({ content, attributes }) => {
		if (attributes.lang !== "coffee") return
		const code = compile(content, {
			bare: true,
			inlineMap: false,
			sourceMap: false,
		})
		return { code }
	},
}
