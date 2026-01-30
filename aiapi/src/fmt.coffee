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
    return ''
  fmtJson(chat, pli)
