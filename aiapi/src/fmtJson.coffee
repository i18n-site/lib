#!/usr/bin/env coffee

> ./fmtSeg.js
  ./partition.js

export default (chat, txt)=>
  if not txt
    return []
  pli = await partition(
    chat
    txt
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
