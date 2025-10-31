#!/usr/bin/env coffee

< (li) =>
  bytes = []
  for num from li
    num = BigInt(num)
    while num >= 128n
      bytes.push Number (num & 127n)+128n
      num >>= 7n
    bytes.push Number(num)
  new Uint8Array bytes

