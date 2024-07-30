[‼️]: ✏️README.mdt

# @3-/pair

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import pair from '@3-/pair'
import group from '@3-/pair/group.js'

console.log pair '1|2|3|4|5|6'.split('|')
console.log group 4,'1|2|3|4|5|6|7|8'.split('|')
```

output :

```
[ [ '1', '2' ], [ '3', '4' ], [ '5', '6' ] ]
[ [ '1', '2', '3', '4' ], [ '5', '6', '7', '8' ] ]
```
