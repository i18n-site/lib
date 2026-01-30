#!/usr/bin/env coffee

> ../src/lib.js:pdf2txt
  path > join
  fs > readFileSync

ROOT = import.meta.dirname

console.log pdf2txt(readFileSync(
  join(
    ROOT,
    '2.pdf'
  )
))
