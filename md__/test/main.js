#!/usr/bin/env node

import { strictEqual } from "node:assert/strict"
import md__ from "@3-/md__"
import { micromark } from "micromark"

const 测试 = `

  |+| 标题1
      
      行1-1

      行1-2
    
   其他1

  |+| 标题2
      
      行2-1

      行2-2

   其他2
  
  |-| 标题3[链接](http://example.com)
      行3-1
      行3-2

## 下划线 & 删除线 & 加粗
`

console.log(micromark(md__(测试), { allowDangerousHtml: true }))

const tests = [
	["Hello __world__ test", "Hello <u>world</u> test", "基本下划线测试"],
	[
		"__x__ `__b__` __c__ ```__d__``` __not close",
		"<u>x</u> `__b__` <u>c</u> ```__d__``` __not close",
		"混合代码和下划线测试",
	],
	[
		"__[link](http://example.com)__",
		"<u>[link](http://example.com)</u>",
		"链接包含在下划线中测试",
	],
	["__a\nb__", "__a\nb__", "换行测试"],
	["```\n__code__\n```", "```\n__code__\n```", "代码块测试"],
	["这是~~删除线~~测试", "这是<del>删除线</del>测试", "删除线测试"],
	[
		"同时测试__下划线__和~~删除线~~",
		"同时测试<u>下划线</u>和<del>删除线</del>",
		"混合标记测试",
	],
	["__~~删除的下划线~~__", "<u><del>删除的下划线</del></u>", "嵌套测试"],
	[
		"对__中文__和~~删除线~~更加友好",
		"对<u>中文</u>和<del>删除线</del>更加友好",
		"中文测试",
	],
	[
		"未闭合的~~删除线和__下划线",
		"未闭合的~~删除线和__下划线",
		"未闭合标记测试",
	],
	[
		"```js\n__不会被解析__ ~~也不会被解析~~\n```",
		"```js\n__不会被解析__ ~~也不会被解析~~\n```",
		"代码块中的标记测试",
	],
	["`__不解析__ ~~不解析~~`", "`__不解析__ ~~不解析~~`", "行内代码测试"],
	[
		"Hello__~~w~~o`r`ld__test",
		"Hello<u><del>w</del>o`r`ld</u>test",
		"多格式混杂测试",
	],
]

for (const [input, expected, message] of tests) {
	try {
		strictEqual(md__(input), expected, message)
		console.log(`✓ ${message}`)
	} catch (err) {
		console.log(`✗ ${message}`)
		console.log(`  输入: ${input}`)
		console.log(`  期望: >${expected}<`)
		console.log(`  实际: >${err.actual}<`)
		process.exit(1)
	}
}

console.log("\n所有测试通过！")
