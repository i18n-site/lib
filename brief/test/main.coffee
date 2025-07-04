#!/usr/bin/env coffee

> @3-/brief:Brief
  @3-/read
  path > join

ROOT = import.meta.dirname

MAX_TOKENS = 8192

CONF = [
  'http://127.0.0.1:8010/v1/'
  #'https://api.siliconflow.cn/v1/'
  [
    process.env.SF_KEY
  ]
]

MODEL = 'Qwen3-0.6B'
# MODEL = 'Qwen/Qwen3-8B'

BRIEF = Brief(CONF, MODEL, MAX_TOKENS)
txt = read(join(ROOT, 'test.txt'))
[tag_li] = await BRIEF txt.slice(0,450)
console.log tag_li

begin = new Date
[tag_li, brief] = await BRIEF txt
console.log tag_li
console.log brief
console.log brief.length
console.log txt.length+'字, 耗时'+Math.round((new Date - begin)/10)/100+'秒'

