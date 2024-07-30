[‼️]: ✏️README.mdt

# @3-/msgpack

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import pack from '@3-/msgpack/pack.js'
import unpack from '@3-/msgpack/unpack.js'


console.log pack 1
console.log unpack pack 1
```

output :

```
<Buffer 01>
1
```
