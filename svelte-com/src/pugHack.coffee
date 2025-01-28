#!/usr/bin/env coffee

import pugExtract from './pugExtract.js'

CMD = new Set('if else elif elseif key each await then catch html const debug'.split(' '))

split = (txt)=>
  li = []
  t = []

  state = 0

  for i from txt
    if state == 0
      if i == '"'
        state = 1
        t.push i
        continue
      if i == ' '
        li.push t.join('')
        t = []
      else
        t.push i
    else if state == 1
      if i == '"'
        if t[t.length-1]!='\\'
          state = 0
      t.push i

  if t.length
    li.push t.join('')
  li


bind = (pug)=>
  pugExtract(pug).map (txt)=>
    last = txt.length - 1
    if (txt[0] != '(') or (txt[last] != ')')
      return txt
    txt = txt.slice(1,last)
    txt = split(txt).map(
      (line)=>
        if not line.trim()
          return line
        attr = line.trimStart()
        begin = line.length - attr.length
        attr = attr.trimEnd()
        end = begin + attr.length

        begin = line[...begin]
        end = line[end..]

        set = (txt)=>
          line = begin+txt+end

        wrap = (txt,attr)=>
          if not attr.startsWith '{'
            attr = '{'+attr+'}'
          set txt+'"'+attr+'"'

        replace = (key, to)=>
          at_pos = attr.indexOf(key)+key.length
          pos = attr.indexOf('=',at_pos)+1
          wrap attr[...at_pos-1]+to+attr[at_pos...pos],attr[pos..]

        if attr
          if attr.indexOf('="')<0
            if attr.endsWith ':'
              set '{'+attr.slice(0,attr.length-1)+'}'
            else
              switch attr.charAt(0)
                when '@'
                  if attr.charAt(1) == '&'
                    wrap 'bind:this=', attr[2..]
                  else
                    等号 = attr.indexOf '='
                    if 等号 < 0
                      attr = attr[1..]
                      if attr != 'message'
                        wrap 'on'+attr+'=',attr.split('|',1)[0]
                      else
                        set 'on'+attr
                    else
                      replace '@','on'
                when '&'
                  wrap 'bind:value=',attr[1..]
                else
                  pos = attr.indexOf('&')
                  等号 = attr.indexOf '='
                  if pos > 0 and 等号<0
                    wrap 'bind:'+attr[...pos]+'=', attr[pos+1..]
                  else
                    pos = attr.indexOf(':')
                    if pos > 0 and 等号 < 0
                      wrap attr[...pos]+'=', attr[pos+1..]
                    else
                      冒号 = attr.indexOf ':'
                      if 冒号 > 0 and 冒号<等号
                        wrap attr[..等号],attr[等号+1..]

        line
    ).join(' ')
    txt = '('+txt+')'


export default main = (pug)=>
  li = []
  pug_li = bind(pug).join('')
  for line in pug_li.split('\n')
    ts = line.trimStart()
    i = ts.trimEnd()
    if i.charAt(0) == '+'
      pos = i.indexOf(' ',2)
      if pos > 0
        cmd = i[1...pos]
        if CMD.has cmd
          if cmd == 'elif'
            cmd = 'elseif'
          line = ''.padEnd(line.length-ts.length)+'+'+cmd+'(\''+i[pos+1..].replaceAll('\'','\\\'')+'\')'
    li.push line
  li.join('\n')
