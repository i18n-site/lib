#!/usr/bin/env coffee

> @3-/qwen:Qwen

qwen = await Qwen '/tmp'
await qwen('当前目录是什么？')
# await qwen('创建文件 news.md , 内容是今天的新闻，请搜索并创建，用markdown格式')
console.log 'done'
