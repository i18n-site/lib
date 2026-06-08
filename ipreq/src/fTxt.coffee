> ./index.js:req
  @3-/utf8/utf8d.js

< (args...)=>
  r = await req(...args)
  r[0] = utf8d r[0]
  r
