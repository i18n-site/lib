[‼️]: ✏️README.mdt

# @3-/ossput

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/ossput
  ./cdn.js > CDN
  fs > createReadStream
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)


put = ossput CDN

file = import.meta.url.slice(7)

await put(
  "test.coffee"
  =>
    createReadStream(file)
  "text/js"
  file
)
# console.log file
```

output :

```
/Volumes/d/i18n/lib/ossput/test/main.coffee → https://f003.backblazeb2.com/file/i18ncdn/test.coffee
```
