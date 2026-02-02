const STATE_NORMAL = 0,
	STATE_IN_STRING = 1,
	STATE_IN_LINE_COMMENT = 2,
	STATE_IN_BLOCK_COMMENT = 3

export default (proto) => {
	let 状态 = STATE_NORMAL
	let 结果 = ""
	let i = 0
	while (i < proto.length) {
		const 字符 = proto[i]
		const 下一个字符 = i + 1 < proto.length ? proto[i + 1] : null

		switch (状态) {
			case STATE_NORMAL:
				if (字符 === "/" && 下一个字符 === "/") {
					状态 = STATE_IN_LINE_COMMENT
					i += 2
				} else if (字符 === "/" && 下一个字符 === "*") {
					状态 = STATE_IN_BLOCK_COMMENT
					i += 2
				} else if (字符 === '"') {
					状态 = STATE_IN_STRING
					结果 += 字符
					i++
				} else {
					结果 += 字符
					i++
				}
				break
			case STATE_IN_STRING:
				if (字符 === "\\" && 下一个字符 === '"') {
					结果 += 字符 + 下一个字符
					i += 2
				} else if (字符 === '"') {
					状态 = STATE_NORMAL
					结果 += 字符
					i++
				} else {
					结果 += 字符
					i++
				}
				break
			case STATE_IN_LINE_COMMENT:
				if (字符 === "\n" || 字符 === "\r") {
					状态 = STATE_NORMAL
					结果 += 字符
					i++
				} else {
					i++
				}
				break
			case STATE_IN_BLOCK_COMMENT:
				if (字符 === "*" && 下一个字符 === "/") {
					状态 = STATE_NORMAL
					i += 2
				} else {
					i++
				}
				break
		}
	}
	return 结果.replace(/[\r\n]+/g, "\n")
}
