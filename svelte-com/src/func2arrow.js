import { ESLint } from "eslint"

import eslintJS from "@eslint/js"

import arrow from "eslint-plugin-prefer-arrow-functions"

export default async (code) => {
	var eslint, result
	eslint = new ESLint({
		fix: true,
		overrideConfigFile: true, // 显式声明使用编程式配置
		overrideConfig: [
			eslintJS.configs.recommended, // 导入推荐规则
			{
				languageOptions: {
					sourceType: "module",
				},
				plugins: {
					"prefer-arrow-functions": arrow,
				},
				rules: {
					"prefer-arrow-functions/prefer-arrow-functions": [
						"error",
						{
							allowNamedFunctions: false,
							classPropertiesAllowed: false,
						},
					],
				},
			},
		],
	})
	;[result] = await eslint.lintText(code)
	return result?.output || code
}
