# wasm-set

wasm wrapper for rust [blake3](https://docs.rs/blake3/latest/blake3/)

use :
[→ test.coffee](test.coffee)

```coffee
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

```


out :
[→ out.txt](out.txt)

```txt
set.add(new Uint8Array([1])) = true
set.has([1]) = true
set.size = Uint8Array(1) [ 1 ]
set.dump() = 1
BinSet.load(set.dump(),1).size = 1
set.delete([1]) = true
set.size = 0
set.has([1]) = false
set.delete([1]) = false
set.has([2]) = false
```

