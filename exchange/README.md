# @3-/exchange

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/exchange
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

for [f,t] from [
  ['EUR','USD']
  ['USD','EUR']
]
  console.log f,t,await exchange f, t
```

output :

```

https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=EUR&crdhldBillCurr=USD&bankFee=0&transAmt=1 SyntaxError: Unexpected token '<', "
<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
    at parseJSONFromBytes (node:internal/deps/undici/undici:4292:19)
    at successSteps (node:internal/deps/undici/undici:4274:27)
    at fullyReadBody (node:internal/deps/undici/undici:2695:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async consumeBody (node:internal/deps/undici/undici:4283:7)
    at async file:///Users/z/i18n/node/exchange/node_modules/.pnpm/@3-+fetch@0.1.2/node_modules/@3-/fetch/timeout.js:11:15
    at async file:///Users/z/i18n/node/exchange/lib/index.js:23:15
    at async file:///Users/z/i18n/node/exchange/node_modules/.pnpm/@3-+retry@0.0.1/node_modules/@3-/retry/index.js:13:17
    at async file:///Users/z/i18n/node/exchange/test/main.coffee:13:22

https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=EUR&crdhldBillCurr=USD&bankFee=0&transAmt=1 SyntaxError: Unexpected token '<', "
<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
    at parseJSONFromBytes (node:internal/deps/undici/undici:4292:19)
    at successSteps (node:internal/deps/undici/undici:4274:27)
    at fullyReadBody (node:internal/deps/undici/undici:2695:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async consumeBody (node:internal/deps/undici/undici:4283:7)
    at async file:///Users/z/i18n/node/exchange/node_modules/.pnpm/@3-+fetch@0.1.2/node_modules/@3-/fetch/timeout.js:11:15
    at async file:///Users/z/i18n/node/exchange/lib/index.js:23:15
    at async file:///Users/z/i18n/node/exchange/node_modules/.pnpm/@3-+retry@0.0.1/node_modules/@3-/retry/index.js:13:17
    at async file:///Users/z/i18n/node/exchange/test/main.coffee:13:22
EUR USD [ 19841, 1075600 ]
USD EUR [ 19841, 937031 ]
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