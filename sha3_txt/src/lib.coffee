> @3-/utf8/utf8e.js
  crypto > createHash

< (val)=>
  hash = createHash('sha3-256')
  hash.update utf8e(val)
  hash.digest()
