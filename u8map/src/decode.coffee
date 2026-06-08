> @3-/pair
  @3-/utf8/utf8d.js

< (bin)=>
  r = {}
  if bin.length
    b = 0
    p = 0
    len = bin.length + 1
    k = 0
    while p < len
      i = bin[p]
      if not i
        n = utf8d bin.slice(b,p)
        if k == 0
          k = n
        else
          r[k] = n
          k = 0
        b = p + 1
      ++p
  r
