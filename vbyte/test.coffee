#!/usr/bin/env coffee

> ./pkg/_ > vbyteD vbyteE


testVbyte = =>
  b = vbyteE [999, 2, 321]
  console.log b
  console.log vbyteD b
  return

testVbyte()

