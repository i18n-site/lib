#!/usr/bin/env coffee

# todo 没有对字符串的引号和转义进行处理

ONE_LINE_COMMNENT = 1
MULTI_LINE_COMMENT = 2

pythonComment = (txt)=>
  out = []
  comment_pos = []
  txt_li = txt.split '\n'
  for i,pos in txt_li
    it = i.trimStart()
    if it.startsWith '#'
      t = ''.padEnd(i.length - it.length)+'#'
      i = i.slice(1)
      it = i.trimStart()
      out.push t+''.padEnd(i.length - it.length)
      i = it.trimEnd()
      comment_pos.push out.length
      out.push i
      push = ''
    else
      push = i
    if 1+pos != txt_li.length
      push += '\n'
    out.push push
  [
    out
    comment_pos
  ]

cStyleComment = (txt)=>
  out = []
  buffer = ''
  comment_pos = []
  + state

  p = 0
  {length:txtlen} = txt

  push = =>
    out.push buffer
    buffer = ''
    return

  push_code = =>
    comment_pos.push out.length
    t = buffer.trimEnd()
    suffix = buffer.slice(t.length)
    buffer = buffer.slice(0,t.length)
    push()
    state = 0
    buffer = suffix
    return

  while p < txtlen
    i = txt[p++]
    if state == MULTI_LINE_COMMENT
      if i == '*' and txt[p] == '/'
        ++p
        push_code()
        buffer+='*/'
      else
        buffer += i
    else if state == ONE_LINE_COMMNENT
      buffer += i
      if txt[p] == '\n'
        push_code()
    else
      if i == '/'
        switch txt[p]
          when '/'
            ++p
            state = ONE_LINE_COMMNENT
            buffer += '//'
            while txt[p].trim() == ''
              buffer += txt[p++]
            push()
            continue
          when '*'
            ++p
            buffer += '/*'
            while txt[p].trim() == ''
              buffer += txt[p++]
            push()
            state = MULTI_LINE_COMMENT
            continue
      buffer += i

  if state
    push_code()
  else
    push()

  [
    out
    comment_pos
  ]


export default {
  rust:cStyleComment
  c: cStyleComment
  cpp: cStyleComment
  java: cStyleComment
  js: cStyleComment
  coffee: pythonComment
  py: pythonComment
  python: pythonComment
  bash: pythonComment
}

