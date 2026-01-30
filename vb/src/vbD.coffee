#!/usr/bin/env coffee

decode = (bytes)=>
  val = BigInt 0

  byte_index = 0n
  for byte, pos in bytes
    val += BigInt(byte & 0x7f) << byte_index
    byte_index+=7n
    if byte < 128
      break

  [
    Number val
    bytes.slice(pos+1)
  ]

< (bytes) =>
  rest = bytes
  r = []
  while rest.length
    [n, rest] = decode(rest)
    r.push n
  r
  # r = []
  # t = []
  # for i from bytes
  #   if i < 128
  #     r.push decode t
  #     t = []
  #   t.push i
  # r
