[‼️]: ✏️README.mdt

# @3-/token

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/token/decode.js
  @3-/b64/b64d.js

SK = b64d(process.env.TOKEN_SK)
TOKEN = 'qYtgTXoAFHDEoa0l0Y3fwui04gQB1w8'

console.log await decode SK, TOKEN
```

output :

```
./out.txt
```
