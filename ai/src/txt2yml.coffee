#!/usr/bin/env coffee

> @3-/yml > loads

< (txt)=>
  li = []

  for i from txt.split('\n')
    i = i.trimEnd()
    if (not i) or i.startsWith('`')
      continue
    p = i.indexOf ': '
    if p > 0
      p+=2
      prefix = i.slice(0,p)
      suffix = i.slice(p).trim()
      # console.log {prefix,suffix}
      if not suffix.startsWith('"')
        if suffix.includes(':')
          i = prefix+JSON.stringify(suffix)
    else if i.charAt(0).trim()
      if not i.endsWith(':')
        continue

    li.push i

  ymlstr = li.join('\n')
  if not ymlstr
    ymlstr = txt
  # console.log '----\n\n'+ymlstr+'\n\n-----'
  try
    return loads ymlstr
  catch e
    console.error txt+'\n',e
    throw e
  return
