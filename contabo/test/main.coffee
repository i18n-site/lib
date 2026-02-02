#!/usr/bin/env coffee

> @3-/contabo
  @3-/contabo/pageIter.js
  os > homedir
  path > join

api = await contabo(
  await import(join(homedir(), '.config/contabo/js0.js'))
)

for await instance from pageIter(api,'compute/instances')
  console.log(instance)
