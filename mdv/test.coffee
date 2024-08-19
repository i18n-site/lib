#!/usr/bin/env coffee

> ./pkg/_.js > id_url_li

testMdv = =>
  console.log id_url_li([
    [
      12322322,
      'abcde',
    ]
    [
      45624234,
      'xyz',
    ]
  ])
  # map = new JsMap
  # r = =>
  #   12345
  #
  # key = new Uint8Array([1,2])
  # map.set key, r
  # console.log map.size
  # r = map.get(key)
  # console.log r()
  # for i in map.entries()
  #   console.log '>',i
  return

testMdv()
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
