#!/usr/bin/env coffee

> ./lib.js:run
  path > resolve join

conf = process.argv.slice(2)[0]
await run(conf)
