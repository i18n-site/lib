#!/usr/bin/env coffee

> ./pkg/_ > BinMap b64VbyteD b64VbyteE u64B64 BinSet binU64 u64Bin

console.log u64B64 12345

testVbyte = =>
  b = b64VbyteE [999, 2, 321]
  console.log b
  console.log b64VbyteD b
  return

# testVbyte()

testBinU64 = =>
  bin = u64Bin 9876543210
  console.log binU64 bin
  return

testBinU64()

testBinMap = =>
  map = new BinMap
  r = =>
    12345

  key = new Uint8Array([1,2])
  map.set key, r
  console.log map.size
  r = map.get(key)
  console.log r()

testBinSet = =>
  set = new BinSet
  key = new Uint8Array([1,2])
  set.add key
  console.log set.size
  console.log set.clear()
  console.log set.size
  return

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
