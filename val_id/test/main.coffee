#!/usr/bin/env coffee

> @3-/val_id:ValId
  @3-/val_id/cachedValId
  ./DB.js

valId = ValId DB.q
srvId = valId 'srv'

console.log await srvId('kvrocks')

valId = cachedValId DB.q
srvId = await valId 'srv'

console.log await srvId('kvrocks')

process.exit()
