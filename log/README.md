[‼️]: ✏️README.mdt

# @3-/log

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/log/GREEN.js:@ > green
  @3-/log/ORANGE.js
  @3-/log/WARN.js
  @3-/log/ERR.js

ERR 123
WARN 123
GREEN 123
ORANGE(123,green("456"))
```

output :

```
[;32m123[0m
[38;2;255;68;0m123[0m [38;2;255;68;0m[;32m456[0m[0m
```
