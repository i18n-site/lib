#!/usr/bin/env coffee

> ./fmtJson.js
  ./fmtJsonMd.js

< (chat, txt) =>
  fmtJsonMd(
    await fmtJson(chat, txt)
  )
