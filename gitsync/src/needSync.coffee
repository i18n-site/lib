#!/usr/bin/env coffee

FLAG='🔹'

export default (raw)=>
  merge_base = await raw('merge-base src/dev main')
  li = (await raw(
    'log src/dev --oneline'
    merge_base+'..HEAD'
  )).split('\n').map (i)=>
    p = i.indexOf ' '
    sha = i.slice(0,p)
    msg = i.slice(p+1)
    [msg, sha]

  for [msg, sha], pos in li
    for i in li.slice(pos)
      if i[0].startsWith 'Merge'
        sha = i[1]
      else
        break
    if msg.startsWith FLAG
      msg_li = []
      exist = new Set
      for [i] from li
        if i.startsWith FLAG
          i = i.slice(FLAG.length)
        i = i.trim()
        if i.length > 3 and not i.startsWith 'Merge'
          if not exist.has i
            msg_li.push i
            exist.add i
      # console.log 'breakpoint'
      # await new Promise(=>)
      return [
        merge_base
        sha
        msg_li.join('\n')
      ]
  return
