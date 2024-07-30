[‼️]: ✏️README.mdt

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
    at async file:///Users/z/i18n/lib/exchange/node_modules/.pnpm/@3-+fetch@0.1.2/node_modules/@3-/fetch/timeout.js:11:15
    at async file:///Users/z/i18n/lib/exchange/lib/index.js:23:15
    at async file:///Users/z/i18n/lib/exchange/node_modules/.pnpm/@3-+retry@0.0.1/node_modules/@3-/retry/index.js:13:17
    at async file:///Users/z/i18n/lib/exchange/test/main.coffee:13:22

https://www.mastercard.us/settlement/currencyrate/conversion-rate?fxDate=0000-00-00&transCurr=EUR&crdhldBillCurr=USD&bankFee=0&transAmt=1 SyntaxError: Unexpected token '<', "
<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
    at parseJSONFromBytes (node:internal/deps/undici/undici:4292:19)
    at successSteps (node:internal/deps/undici/undici:4274:27)
    at fullyReadBody (node:internal/deps/undici/undici:2695:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async consumeBody (node:internal/deps/undici/undici:4283:7)
    at async file:///Users/z/i18n/lib/exchange/node_modules/.pnpm/@3-+fetch@0.1.2/node_modules/@3-/fetch/timeout.js:11:15
    at async file:///Users/z/i18n/lib/exchange/lib/index.js:23:15
    at async file:///Users/z/i18n/lib/exchange/node_modules/.pnpm/@3-+retry@0.0.1/node_modules/@3-/retry/index.js:13:17
    at async file:///Users/z/i18n/lib/exchange/test/main.coffee:13:22
EUR USD [ 19841, 1075600 ]
USD EUR [ 19841, 937031 ]
```
