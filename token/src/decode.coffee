> @3-/u8/u8eq.js
  @3-/vb/vbD.js

import { Buffer } from 'node:buffer'

HASH_LEN = 10
BEGIN_TS = 1719800000

< (sk, token)=>
  buf = Buffer.from token,'base64url'
  hash = buf.slice(0,HASH_LEN)
  id_li = buf.slice(HASH_LEN)

  combined = new Uint8Array sk.length + id_li.length
  combined.set id_li
  combined.set sk, id_li.length

  r = new Uint8Array await crypto.subtle.digest('SHA-256', combined)
  if u8eq r.slice(0,HASH_LEN), hash
    # [uid, token_id, ts]
    li = vbD id_li
    li[2] += BEGIN_TS # ts offset
    return li
  return
