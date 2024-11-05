#!/usr/bin/env coffee

> ./pkg/_ > binU64 u64Bin
  @3-/b64/uB64e.js
  @3-/b64/b64e.js
  @3-/b64/b64d.js

test = =>
  i = 123461887
  bin = u64Bin i
  console.log bin
  console.log binU64(bin)
  s = uB64e bin
  bin = Buffer.from s,'base64url'
  console.log binU64 bin
  return

test()
# testBinSet()

  # set = new BinSet
  #
  # txt = """set.add(Buffer.from [1])
  # set.has([2])
  # set.has([1])
  # set.add(new Uint8Array([1]))
  # set.has([1])
  # set.size
  # set.dump()
  # BinSet.load(set.dump(),1).size
  # set.delete([1])
  # set.size
  # set.has([1])
  # set.delete([1])
  # set.has([2])""".split('\n')
  #
  # [
  #   set.add(Buffer.from [1])
  #   set.has([2])
  #   set.has([1])
  #   set.add(new Uint8Array([1]))
  #   set.has([1])
  #   set.dump()
  #   set.size
  #   BinSet.load(set.dump(),1).size
  #   set.delete([1])
  #   set.size
  #   set.has([1])
  #   set.delete([1])
  #   set.has([2])
  # ].map (i,pos)=>console.log(txt[pos],'=',i)
  # return
