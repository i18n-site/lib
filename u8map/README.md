[‼️]: ✏️README.mdt

# @3-/u8map

把字符串字典转为一个 Uint8Array（用 0 分隔，因为字符串不包含 0）

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/u8map/encode.js
  @3-/u8map/decode.js

bin = encode {
  a : '测试'
  b : '123'
}

console.log decode bin
```

output :

```
{ a: '测试', b: '123' }
```
