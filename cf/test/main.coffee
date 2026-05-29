#!/usr/bin/env coffee

> ../src/lib.js:Cf
  ../src/Zone.js

{env} = process

cf = Cf(
  env.CF_KEY
  env.CF_MAIL
)

HOST = 'xxai.eu.org'
zone = await Zone(cf, HOST)

await zone.reset(
  'test'
  {
    A: [
      '1.1.1.3'
    ]
  }
)
await zone.rm('test')
