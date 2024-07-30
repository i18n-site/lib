[‼️]: ✏️README.mdt

# @3-/mdt : 渲染 markdown 模板

模板文件参见 [./README.mdt](./README.mdt)

[test code](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/mdt/make.js
  @3-/uridir

await make uridir(import.meta)
```

output :

```
/Volumes/d/i18n/lib/mdt/test/test.mdt → test.md
```
