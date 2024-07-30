[‼️]: ✏️README.mdt

# @3-/cf_work_secret

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/cf_work_secret:cfsecret
  path > join

ROOT = import.meta.dirname

{ TOKEN, MAIL, ID, WORKER } = process.env

# await cfsecret(
#   [TOKEN, MAIL, ID, WORKER]
#   join ROOT, 'env'
# )
```

output :

```
./out.txt
```
