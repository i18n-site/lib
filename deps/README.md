[‼️]: ✏️README.mdt

# @3-/deps

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/deps
  @3-/uridir
  path > dirname

ROOT = dirname uridir(import.meta)

console.log deps ROOT
```

output :

```
[ '@3-/read', '@3-/uridir' ]
```
