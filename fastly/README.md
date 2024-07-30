[‼️]: ✏️README.mdt

# @3-/fastly

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/fastly > purge

await purge(
  process.env.FASTLY_TOKEN
  'dist-v.i18n.site'
  'v/i18n.site'
)
```

output :

```
./out.txt
```
