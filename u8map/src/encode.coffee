> @3-/utf8/utf8e.js
  @3-/u8/u8merge.js

< (m)=>
  r = []
  for i from Object.entries(m)
    [k,v] = i.map utf8e
    r.push(
      k
      [0]
      v
      [0]
    )
  r.pop()
  u8merge ...r

