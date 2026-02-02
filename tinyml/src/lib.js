const trimTxt = (li) => {
	if (!Array.isArray(li) || li.length === 0) return li
	const first_line_indent = li[0].length - li[0].trimStart().length
	return li.map((line) => {
		const current_indent = line.length - line.trimStart().length
		const trim_length = Math.min(first_line_indent, current_indent)
		return line.slice(trim_length)
	})
}

const KEY = 0,
	VALUE = 1,
	MULTILINE = 2

export default function load(yaml, base_indent = 0) {
	const lines = yaml.split("\n")
	const result = {}
	let current_key = null
	let text_indent = 0
	let state = KEY
	let multi_buffer = []

	const set = (k) => {
		result[current_key] = trimTxt(multi_buffer).join("\n")
	}

	let pos = 0
	const total = lines.length
	while (pos < total) {
		const line = lines[pos++].trimEnd()
		if (state !== MULTILINE) {
			// 忽略注释和空行（非多行字符串状态）
			if (line === "" || line.startsWith("#")) continue
		}

		// 计算缩进长度
		const indent = line.length - line.trimStart().length

		if (state === KEY) {
			const colon_index = line.indexOf(":")
			if (colon_index !== -1) {
				current_key = line.slice(0, colon_index).trim()
				const potential_value = line.slice(colon_index + 1).trim()

				if (potential_value === "|") {
					state = MULTILINE
					multi_buffer = []
					text_indent = indent // 记录当前缩进
				} else if (potential_value) {
					result[current_key] = potential_value
					state = KEY
				} else {
					state = VALUE
				}
			}
		} else if (state === VALUE) {
			if (indent > base_indent) {
				// 嵌套字典，递归解析嵌套部分
				const nested_yaml = lines.slice(pos - 1).join("\n")
				result[current_key] = load(nested_yaml, indent)
				break
			}
			if (line.startsWith("- ")) {
				result[current_key] = result[current_key] || []
				result[current_key].push(line.slice(2).trim())
			} else {
				result[current_key] = line
			}
			state = KEY
		} else if (state === MULTILINE) {
			// 多行字符串状态下保留所有行，包括空行和注释
			if (line) {
				// 检查下一行是否属于同一缩进层级
				if (indent <= text_indent) {
					set()
					state = KEY
					pos -= 1
					continue
				}
			}
			multi_buffer.push(line)
		}
	}

	if (state === MULTILINE) {
		set()
	}

	return result
}
