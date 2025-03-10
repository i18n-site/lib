> ./b64e.js

< (b)=>
  r = []
  for i from b64e(b)
    if i == '+'
      i = '-'
    else if i == '/'
      i = '_'
    r.push i
  r.join ''
