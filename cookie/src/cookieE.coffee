> @3-/utf8/utf8e.js
  @3-/u8/u8merge.js
  @3-/sha3

< (sk, name, value) =>
  value = utf8e JSON.stringify value
  sign = sha3 u8merge(value, sk)
  value = Buffer.from(u8merge(value, sign)).toString('base64url')
  date = new Date()
  date.setTime date.getTime() + 7e10
  return name + '=' + value + ';expires=' + date.toUTCString() + ';path=/;Secure;Partitioned;HttpOnly;SameSite=None'
