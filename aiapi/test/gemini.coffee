#!/usr/bin/env coffee

> @3-/aiapi/gemini.js
  @3-/aiapi/fmtWithFactCheck.js
  path > join
  os > homedir
  @3-/read
  @3-/write

TOKEN_LI = (await import(join(
  homedir()
  '.config/gemini.js'
))).default

chat = gemini TOKEN_LI

ROOT = import.meta.dirname
DIR_CHAT = join ROOT, 'chat'
txt = read join(DIR_CHAT, 'org.txt')

txt =  txt.trim().replace(/^\s*\n/gm, '').replace(/\(\d{2}:\d{2}:\d{2}\)/g,'')

write(join(DIR_CHAT, 'fmt.txt'), txt)

result = await fmtWithFactCheck(chat,txt)


write(
  join DIR_CHAT, 'result.md'
  result
)


process.exit 0
