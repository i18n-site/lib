> @3-/utf8/utf8d.js

< (bin)=>
  li = []
  start = 0
  p = 0
  len = bin.length
  while p <= len # <= 保证最后一个也会处理
    i = bin[p]
    if not i
      li.push utf8d bin.subarray start, p
      start = p + 1
    ++p
  return li
