> ./vbD.js

< (bin)=>
  li = vbD bin
  if li.length > 1
    t = []
    pre = 0
    for i from li
      pre = i + pre
      t.push pre
    li = t
  li

