#!/usr/bin/env coffee

> @3-/contabo
  os > homedir
  path > join

api = await contabo(
  await import(join(homedir(), '.config/contabo/js0.js'))
)

li = await api('compute/instances')

console.log(li)
