#!/usr/bin/env coffee

> ../src/lib.js:TencentSsl
  ./conf.js
  ./R.js

sslSet = TencentSsl(
  ...conf
)

domain = 'js0.site'

key_cert = JSON.parse await R.get("ssl:"+domain)

await sslSet domain, ...key_cert
console.log 'done'
process.exit()
