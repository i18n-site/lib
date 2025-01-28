#!/usr/bin/env coffee

> crypto
  ./conf.js > HASH AES IV

< (passwd, bin) =>
  key = crypto.createHash(HASH).update(passwd).digest()
  decipher = crypto.createDecipheriv(AES, key, IV)
  decrypted = Buffer.concat([decipher.update(bin), decipher.final()])
  return decrypted
