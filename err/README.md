[‼️]: ✏️README.mdt

# @3-/err

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/err:Err


{AbcError} = Err

console.log new AbcError
```

output :

```
Abc [Error]
    at file:///Volumes/d/3Ti/node/err/test/main.coffee:8:13
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:329:24)
    at async loadESM (node:internal/process/esm_loader:28:7)
    at async handleMainPromise (node:internal/modules/run_main:113:12)
```
