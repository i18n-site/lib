#!/usr/bin/env coffee

> @3-/docx2txt
  fs > readFileSync
  path > join

ROOT = import.meta.dirname

console.log await docx2txt readFileSync(join(ROOT,'1.docx'))
