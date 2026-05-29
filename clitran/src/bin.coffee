#!/usr/bin/env coffee

> @3-/clitran

txt = process.argv.slice(2).join(' ').trim()
if txt
  en = await clitran txt
  if txt != en
    txt = "#{en}\n#{txt}"
  console.log txt

process.exit(0)

