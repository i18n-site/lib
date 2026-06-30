#!/usr/bin/env coffee

> @3-/extract
  @3-/extract/extractLi.js
  @3-/extract/extractAllLi.js
# console.log extract('<a>','</a>','12<a>b</a>23')

txt = '<1>a</2><3>b</4>56'
# li = []
for i from extractAllLi(
  '<','>',txt
)
  # li.push i
  console.log i

# t2 = li.map((i)=>i[1]).join('')
# console.log t2 == txt
# console.log txt
# console.log t2
