#!/usr/bin/env coffee

> @3-/ocr:Ocr
  fs > readFileSync
  path > join

{
  ATOMGIT_TOKEN
} = process.env

ocr = Ocr ATOMGIT_TOKEN

ROOT = import.meta.dirname

console.log await ocr(
  readFileSync(join(ROOT, '1.jpg'))
)
