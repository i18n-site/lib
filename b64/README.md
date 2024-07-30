[‼️]: ✏️README.mdt

# @3-/b64

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/b64/b64d.js
  @3-/b64/b64e.js
  @3-/u8/u8eq.js

random = =>
  length = Math.floor(Math.random() * 16)
  li = new Uint8Array(length)
  crypto.getRandomValues(li)
  li

max = 999

while --max
  b = random()
  b64 = b64e(b).replaceAll('=','')
  if not u8eq(b,b64d(b64))
    console.log b
    break

if max == 0
  console.log 'test success'
```

output :

```
test success
```
