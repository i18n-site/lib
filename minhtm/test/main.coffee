#!/usr/bin/env coffee

> @3-/minhtm
  path > join
  fs > readFileSync

html = readFileSync(
  join import.meta.dirname,'index.html'
  'utf8'
)

console.log await minhtm(html)
