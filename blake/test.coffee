#!/usr/bin/env coffee

import {Blake3, hashFp, hashFpLen} from './pkg/_.js'

> @3-/utf8/utf8e.js
  fs > createReadStream
  path > join

test = =>
  fp = join import.meta.dirname, 'test.coffee'
  console.log fp
  console.log await hashFp fp
  fp = join import.meta.dirname, '../package.json'
  console.log fp
  console.log await hashFpLen fp

  # b3 = new Blake3
  # b3.update Buffer.from [123]
  # console.log b3.finalize()
  # console.log blake3Hash('123')
  # console.log blake3Hash(utf8e('123'))
  # li = [49,50,51]
  # console.log blake3Hash(Buffer.from li)
  # bin = new Uint8Array(li)
  # console.log blake3Hash(bin)
  return

test()
