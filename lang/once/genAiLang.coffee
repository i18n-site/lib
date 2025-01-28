#!/usr/bin/env coffee

> ./AI_LANG.js
  ../src/CODE_ID.js
  ../src/ZH.js
  @3-/write
  path > join dirname

li = []
n = 0
for i from AI_LANG
  code = CODE_ID.get(i)
  console.log ++n, i, code, ZH[code]
  li.push code
li.sort (a,b) => a - b

write(
  join(
    dirname(import.meta.dirname)
    'src/AI_LANG.js'
  )
  'export default '+JSON.stringify(li)
)
