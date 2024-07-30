[‼️]: ✏️README.mdt

# @3-/u8

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/u8/U8.js
  @3-/u8/u8merge.js

console.log U8 [1,2,3]

console.log u8merge 'ss', U8 [1,2,3]
```

output :

```
Uint8Array(3) [ 1, 2, 3 ]
Uint8Array(5) [ 0, 0, 1, 2, 3 ]
```
