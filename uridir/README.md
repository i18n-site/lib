[‼️]: ✏️README.mdt

# @3-/uridir

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import uridir from '@3-/uridir'
import {thisfile} from '@3-/uridir'

console.log(uridir(import.meta))
console.log(thisfile(import.meta))
```

output :

```
/Volumes/d/3Ti/node/uridir/test
/Volumes/d/3Ti/node/uridir/test/main.coffee
```
