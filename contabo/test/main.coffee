#!/usr/bin/env coffee

> @3-/contabo
  os > homedir
  path > join
  ../lib/lib.js:contabo

api = await (
  await import(join(homedir(), '.config/contabo/js0.json'))
)

li = await api('compute/instances')

console.log(li)
