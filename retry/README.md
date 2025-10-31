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

## About This Project

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于本项目

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。