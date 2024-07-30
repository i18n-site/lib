[‼️]: ✏️README.mdt

# @3-/dbq

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/dbq > $one

console.log await $one("SELECT 1")
console.log await $one("SELECT 'x'")

process.exit()
```

output :

```
[;90mSET NAMES utf8mb4 - parameters:[][0m
[;90mSELECT 1 - parameters:[][0m
1
[;90mSELECT 'x' - parameters:[][0m
x
```
