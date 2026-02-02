#!/usr/bin/env coffee

> @3-/aiapi
  @3-/read
  path > join

ROOT = import.meta.dirname
MAX_TOKENS = 8192

content = """
请阅读下文:
---
#{read(join(ROOT, 'test.txt')).split('\n').map((i)=>i.trim()).filter((i)=>i.length>0).join('\n').slice(0,MAX_TOKENS*2)}
---
请按以下示意先输出上文标签,后输出摘要,格式为json,用```包裹。
```
{"tags":[],"summary":""}
```
标签不超过7个,用词要简短;
摘要不超过450字,纯文本格式,分多段。
"""

{
  POST
} = aiapi(
  'https://api.siliconflow.cn/v1/'
  [
    process.env.SF_KEY
  ]
)

MODEL = 'Qwen/Qwen3-8B'

console.log content
body = {
  model: MODEL
  messages: [
    {
      role: "user",
      content
    }
  ]
  thinking_level: 'high'
  enable_thinking: true
  stream: false
  max_tokens: MAX_TOKENS
  # stop: ""
  # temperature: 0.7
  # top_p: 0.7
  # top_k: 50
  # frequency_penalty: 0.5
  # response_format: {
  #   type: "text"
  # }
}

r = await POST(
  'chat/completions'
  body
)

console.log r.choices[0].message
