#!/usr/bin/env coffee

> @3-/u8map/encode.js
  @3-/u8map/decode.js

bin = encode {
  a : '测试'
  b : '123'
}

console.log decode bin
