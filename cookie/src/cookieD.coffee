#!/usr/bin/env coffee
> @3-/sha3
  @3-/u8/u8merge.js
  @3-/u8/u8eq.js

< (sk, cookie)=>
  bin = Buffer.from(cookie, 'base64url')
  msg = bin.slice(0,-32)
  sign = sha3 u8merge(msg, sk)
  if not u8eq bin.slice(-32), sign
    return
  msg = JSON.parse msg.toString('utf8')
  return msg
