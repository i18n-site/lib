#!/usr/bin/env coffee

> @3-/intbin/binU64.js
  @3-/intbin/u64Bin.js
  @3-/intbin/u64B64.js
  @3-/intbin/b64U64.js

b = u64Bin 51230
console.log b
console.log binU64(b)

b = u64B64 51230
console.log b
console.log b64U64(b)
