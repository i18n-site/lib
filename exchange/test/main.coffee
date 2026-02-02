#!/usr/bin/env coffee

> @3-/exchange
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

for [f,t] from [
  ['EUR','USD']
  ['USD','EUR']
]
  console.log f,t,await exchange f, t
