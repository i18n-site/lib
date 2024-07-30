[‼️]: ✏️README.mdt

# @3-/isstr

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/isstr
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

console.log isstr 123
console.log isstr '123;'
console.log isstr new String()
```

output :

```
false
true
true
```
