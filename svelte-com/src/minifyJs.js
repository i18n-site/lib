#!/usr/bin/env bun

import { readFile, mkdir, writeFile } from "node:fs/promises"
import { minify } from "@swc/core"
import func2arrow from "./func2arrow.js"

const main = async (js) => {
	return minify(await func2arrow(js), {
		compress: {
			toplevel: true, // 启用顶层优化
			unused: true, // 删除未导出变量
			defaults: true, // 启用所有压缩选项
			drop_console: true,
			hoist_funs: true,
			hoist_vars: true,
			booleans_as_integers: true,
			reduce_funcs: true,
			unsafe: true,
		},
		mangle: {
			toplevel: true, // 缩短顶层变量名
		},
		sourceMap: true,
		ecma: 2022, // 目标标准
		module: true, // 保留 ES Module 语法
	})
}

export default main
// console.log(await main("function f(a){a??=2;alert(a)};export default f;alert(f(undefined))"));
