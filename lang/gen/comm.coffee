#!/usr/bin/env coffee

> ./qwen3
  ./google:@ > CODE_NAME
  ./gemini
  ./rank


comm = new Set()
for [en, zh, code] from qwen3
  google_code = google.get(zh)
  if google_code
    comm.add code
  else
    # console.log 'not google', zh, code, CODE_NAME.get(code)

# console.log 'qwen3', qwen3.length
# console.log comm.size

comm2 = new Set()

for [cn,code] in gemini
  if CODE_NAME.get(code)
    if comm.has(code)
      comm2.add code
  else
    console.log 'miss gemini', cn, code

li = [...comm2]
li.sort (a,b)=>
  (rank.get(b) or 0) - (rank.get(a) or 0)

# console.log 'comm', li.length
export default li
