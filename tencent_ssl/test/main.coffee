#!/usr/bin/env coffee

> ../src/lib.js:TencentSsl
  ./conf.js
  ./R.js

[CONF, [domain]] = conf

sslSet = TencentSsl(CONF)

key_cert = JSON.parse await R.get("ssl:"+domain)

await sslSet key_cert
console.log 'done'
process.exit()
