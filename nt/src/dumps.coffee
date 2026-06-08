#!/usr/bin/env coffee

_dump = (li, indent)=>
  pad = ''.padEnd indent
  r = []
  if Array.isArray(li)
    for i from li
      r.push '\n'+pad+'-'+_dump(i,indent+2)
  else if li.constructor == String
    if li.includes '\n'
      prefix = '\n'+pad+'> '
      return prefix+li.split('\n').join(prefix)
    else
      return ' '+li
  else
    for [k,v] from Object.entries(li)
      r.push '\n'+pad+k+':'+_dump(v,indent+2)
  r.join('')


export default dump = (li)=>
  _dump(li,0).slice(1)
