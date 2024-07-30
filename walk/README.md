[‼️]: ✏️README.mdt

# @3-/walk

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import walk, {walkRel} from '@3-/walk'
import {dirname} from 'path'

{pathname} = new URL(import.meta.url)

dir = dirname dirname pathname

console.log dir

console.log '> full path'
for await i from walk(dir,(i)=>i.includes 'node_modules')
  console.log i

console.log '\n> relative path'
for await i from walkRel(
  dir
  (i)=>
    ['src','node_modules'].includes i
)
  console.log '\t',i
```

output :

```
/Users/z/3Ti/node/walk
> full path
/Users/z/3Ti/node/walk/README.mdt
/Users/z/3Ti/node/walk/out.txt
/Users/z/3Ti/node/walk/test/main.coffee
/Users/z/3Ti/node/walk/dev.sh
/Users/z/3Ti/node/walk/dist.sh
/Users/z/3Ti/node/walk/run.sh
/Users/z/3Ti/node/walk/README.md
/Users/z/3Ti/node/walk/build.sh
/Users/z/3Ti/node/walk/package.json
/Users/z/3Ti/node/walk/lib/index.js
/Users/z/3Ti/node/walk/src/index.coffee

> relative path
	 README.mdt
	 out.txt
	 test/main.coffee
	 dev.sh
	 dist.sh
	 run.sh
	 README.md
	 build.sh
	 package.json
	 lib/index.js
```
