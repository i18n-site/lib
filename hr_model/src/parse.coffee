#!/usr/bin/env coffee

< (txt)=>
  r = []

  + kind_li, li

  txt += '\n#'

  for i from txt.split('\n')
    i = i.trim()
    if i.startsWith '#'
      if kind_li and li.length
        r.push [kind_li, li]

      li = []
      kind_li = []
      for j from i.slice(1).split('/')
        j = j.trim()
        kind_li.push j
    else if i
      li.push i


  return r
