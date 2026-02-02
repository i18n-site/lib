export default (txt) => {
	// 状态常量
	const 普通 = 0,
		回车 = "\n",
		行内代码 = 1,
		代码块 = 2,
		// 标记数组：[标记字符串, 开始位置, 待处理的标记, HTML标签名]
		标记组 = [
			["~~", -1, "", "del"], // 删除线
			["__", -1, "", "u"], // 下划线
		]

	let 块状态 = 普通
	let 结果 = ""
	let 折腾标题
	let 折叠前文 = ""
	let 折叠展开
	let 折叠缩进 = 0

	const 行列表 = txt.split(回车)

	// 哨兵字符,确保折叠被关闭
	行列表.push(".")

	for (let line of 行列表) {
		const trim_start = line.trimStart()

		if (块状态 !== 代码块) {
			if (trim_start.startsWith("```")) {
				块状态 = 代码块
				结果 += line + 回车
				continue
			}

			if (折叠缩进 && trim_start) {
				if (line.length - trim_start.length < 折叠缩进) {
					结果 =
						折叠前文 +
						"<details" +
						(折叠展开 ? " open" : "") +
						"><summary>\n\n" +
						折腾标题 +
						"\n\n</summary>\n\n" +
						结果.trimEnd() +
						"\n</details>\n\n"
					折叠缩进 = 0
				} else {
					line = line.slice(折叠缩进)
				}
			}

			if (!折叠缩进) {
				折叠展开 = trim_start.startsWith("|-| ")
				if (折叠展开 || trim_start.startsWith("|+| ")) {
					折叠前文 = 结果
					结果 = ""
					折叠缩进 = line.length - trim_start.length + 4
					折腾标题 = trim_start.slice(4).trimEnd()
					continue
				}
			}
		} else {
			结果 += line + 回车
			if (trim_start.trimEnd() === "```") {
				块状态 = 普通
			}
			continue
		}

		let 行状态 = 普通,
			len = line.length

		// 处理普通文本和行内代码
		for (let i = 0; i < len; i++) {
			const 字符 = line[i]

			switch (行状态) {
				case 普通:
					if (字符 === "`") {
						行状态 = 行内代码
						结果 += "`"
					} else {
						let 已处理标记 = false
						for (const 标记 of 标记组) {
							if (line.startsWith(标记[0], i)) {
								if (标记[1] === -1) {
									标记[1] = 结果.length
									标记[2] = 标记[0]
									i += 标记[0].length - 1
								} else {
									结果 =
										结果.slice(0, 标记[1]) +
										`<${标记[3]}>` +
										结果.slice(标记[1]) +
										`</${标记[3]}>`
									标记[1] = -1
									标记[2] = ""
									i += 标记[0].length - 1
								}
								已处理标记 = true
								break
							}
						}

						if (!已处理标记) {
							结果 += 字符
						}
					}
					break

				case 行内代码:
					结果 += 字符
					if (字符 === "`") {
						行状态 = 普通
					}
					break
			}
		}

		// 行结束时处理未闭合的标记
		for (let j = 标记组.length - 1; j >= 0; j--) {
			const 标记 = 标记组[j]
			if (标记[1] !== -1) {
				结果 = 结果.slice(0, 标记[1]) + 标记[2] + 结果.slice(标记[1])
				标记[1] = -1
				标记[2] = ""
			}
		}

		// 添加换行符（除了最后一行）
		结果 += 回车
	}

	结果 = 结果.slice(0, -3)

	return 结果
}
