[‼️]: ✏️README.mdt

# @3-/caller_line

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/caller_line

test = =>
  throw Error()

do =>
  try
    test()
  catch
    console.log CallerLine()
```

output :

```
file:///Users/z/3Ti/node/caller_line/test/main.coffee:16:3
```
