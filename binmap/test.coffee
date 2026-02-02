#!/usr/bin/env coffee

> ./pkg/_ > BinMap

m = new BinMap

m.set(
  new Uint8Array(1)
  new Uint8Array([1,2,3])

)

m.set new Uint8Array([5]), new Uint8Array [5,6]

m = BinMap.load m.dump()

console.log(
  m.get(
    new Uint8Array(1)
  )
)
console.log m.size
