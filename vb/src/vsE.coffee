> ./vbE.js

# 排序,然后差分

< (li)=>
  if li.length > 1
    li.sort (a,b)=>a-b
    pre = 0
    t = []
    for i from li
      t.push i - pre
      pre = i
    li = t
  vbE li


