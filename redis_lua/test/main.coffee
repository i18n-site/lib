#!/usr/bin/env coffee

> @3-/redis_lua
  ../../../../js0/conf/env/kvrocks/IOREDIS.js

console.log await RedisLua(
  import.meta.dirname
  IOREDIS
  'mail'
)

process.exit()
