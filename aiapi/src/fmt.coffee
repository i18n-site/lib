#!/usr/bin/env coffee

> ./fmtJson.js
  ./partition.js

< (chat, txt) =>
  [
    题
    pli
  ] = await partition(
    chat
    txt
  )
  if not pli.length
    return [题,'']
  [
    题
    await fmtJson(chat, pli)
  ]
