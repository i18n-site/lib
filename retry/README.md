[‼️]: ✏️README.mdt

# @3-/retry

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/retry

test = retry =>
  console.log 'call test func'
  throw Error 'test'

test()
```

output :

```
call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/test/main.coffee:11:1
    at ModuleJob.run (node:internal/modules/esm/module_job:217:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17
    at file:///Users/z/3Ti/node/retry/test/main.coffee:11:1
    at ModuleJob.run (node:internal/modules/esm/module_job:217:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)

❯ retry 0

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 1

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 2

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 3

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 4

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 5

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 6

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 7

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 8

call test func

file:///Users/z/3Ti/node/retry/test/main.coffee:6:8
 [Function (anonymous)]
Trace: Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
    at file:///Users/z/3Ti/node/retry/lib/index.js:17:17

❯ retry 9

node:internal/process/promises:262
          triggerUncaughtException(err, true /* fromPromise */);
          ^

Error: test
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26
Thrown at:
    at file:///Users/z/3Ti/node/retry/test/main.coffee:8:9
    at file:///Users/z/3Ti/node/retry/lib/index.js:13:26


Node.js v20.8.1
```
