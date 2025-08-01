#!/usr/bin/env coffee

> ./fmtSeg.js
  ./partition.js
  ./seg.js

export default (chat, txt)=>
  if not txt
    return []
  txt_li = txt.split('\n')
  split_li = await seg chat, txt_li
  pli = partition(
    txt_li
    split_li.map (i)=>
      [
        i.题
        i.行
      ]
  )
  result = []
  sum = 0
  tmp = []

  gen = =>
    result.push fmtSeg(chat, tmp.join('\n'))
    return

  for i from pli
    tmp.push i
    sum += i.length
    if sum > 3000
      console.log sum
      gen()
      sum = 0
      tmp = []

  if tmp.length
    gen()

  return Promise.all result
