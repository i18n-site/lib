#!/usr/bin/env coffee

> @3-/ttlmap
  @3-/sleep

map = ttlmap 1e2
map.set(1,2)
await sleep(1e1)
map.set(2,2)
console.log map.get(1)
await sleep(1e3)
console.log map.get(1)
