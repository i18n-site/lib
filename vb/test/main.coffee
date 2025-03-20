#!/usr/bin/env coffee

> @3-/vb/vbE
  @3-/vb/vbD
  @3-/vb/vsE
  @3-/vb/vsD

#   @w5/uridir
#   path > join

# ROOT = uridir(import.meta)

for li from [
  [11,3,9,2,9,10]
  [2,0]
  [3,5]
  [9]
  []
]
  console.log li
  console.log vsD(vsE(li))
# li = [
#   Number.MAX_SAFE_INTEGER
#   127
#   128
#   256
#   1234567890
# ]
#
# console.log li
#
# b = vbE li
# console.log b
# console.log vbD b
#   # console.log n, n == vbyteD b
