load = (li)=>
  if li.length > 0
    if li[0][0][1].startsWith '-'
      up = []
      func = list
    else
      up = {}
      func = dict
    for i from li
      func up,i
    return up
  {}

strli = (li)=>
  li.map(
    (i)=>i[0][1].slice(2)
  ).join('\n')

list = (up, li)=>
  t = li[0][1]
  if t.startsWith '-'
    n = li[1]
    if n.length
      r = load n
    else
      r = t.slice(1).trimStart()
    if Array.isArray(r)
      if li[0][1].startsWith '-'
        r = [
          li[0][1].slice(1).trimStart()
          r
        ]
    up.push r
  return

dict = (up, li)=>
  key = li[0][1]
  # for i from li[1]
  #   pprint up,i,indent+2
  # li = li[1]

  pos = key.indexOf(':')
  if ~ pos
    if pos == key.length - 1
      li1 = li[1]
      key = key.slice(0,-1).trimEnd()
      if li1.length > 0
        sub = li1[0][0][1]
        if sub.startsWith '> '
          up[key] = strli(li1)
        else
          if sub.startsWith '-'
            next = []
            func = list
          else
            func = dict
            next = {}
          up[key] = next
          for i from li1
            func(next, i)
      else
        up[key] = ''
    else
      up[key.slice(0,pos).trimEnd()] = key.slice(pos+1).trimStart()
  up


< (txt)=>
  txt = txt.replaceAll('\r\n','\n').replaceAll('\r','\n')
  pre_indent = -1
  tree = [[-1],[]]
  now = tree
  stack = [now]
  for i from txt.split '\n'
    {length} = i
    i = i.trimStart()
    if (not i) or i.startsWith('#')
      continue
    indent = length - i.length
    i = i.trimEnd()
    if indent > pre_indent
      pre_indent = indent
      now[1].push now = [[indent,i],[]]
      stack.push now
    else if indent < pre_indent
      loop
        stack.pop()
        t = stack.at(-1)
        if t[0][0] < indent
          now = t
          break
      now[1].push now = [[indent,i],[]]
      stack.push now
      pre_indent = indent
    else
      stack.pop()
      now =  [[indent,i],[]]
      stack.at(-1)[1].push now
      stack.push now
  load tree[1]
