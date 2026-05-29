#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { get } from "node:https"
import parse from "../src/parse.js"
import createShadowsocksAgent from "../src/lib.js"

const 读取并解析所有ss配置 = () => {
	const configs = []
	const 当前目录 = import.meta.dirname
	const ss文件路径 = join(当前目录, "ss")
	const 文件内容 = readFileSync(ss文件路径, { encoding: "utf-8" })
	for (const i of 文件内容.split("\n")) {
		if (i.startsWith("ss://")) {
			configs.push(parse(i))
		}
	}
	return configs
}

const runTest = async (ssConfig) => {
	const agent = await createShadowsocksAgent(ssConfig)
	const name = ssConfig[0]

	console.log(`${name} 正在通过代理请求 https://ifconfig.me/ip ...`)

	return new Promise((resolve, reject) => {
		const req = get("https://ifconfig.me/ip", { agent }, (res) => {
			let body = ""
			res.on("data", (chunk) => (body += chunk))
			res.on("end", () => {
				console.log(`[${name}] 状态码: ${res.statusCode}`)
				console.log(`[${name}] IP: ${body.trim()}`)
				resolve()
			})
		})
		req.on("error", (err) => {
			console.error(`[${name}] 请求错误:`, err)
			reject(err)
		})
	})
}

const test = async () => {
	const allConfigs = 读取并解析所有ss配置()
	console.log(`发现 ${allConfigs.length} 个ss配置，正在开始测试...`)

	const results = await Promise.allSettled(allConfigs.map(runTest))

	results.forEach((result, index) => {
		if (result.status === "rejected") {
			const ssConfig = allConfigs[index]
			console.error(`测试失败: ${ssConfig[0]}`, result.reason)
		}
	})

	console.log("所有测试完成")
}

test()