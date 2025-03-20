#!/usr/bin/env coffee

import gt_import from './import.js'

coffee_label = (code)=>
  li = []
  pre_indent = 0
  pre = 0
  -0
  `OUT: //`
  for line from code
    s = line.trimStart()
    indent = line.length - s.length
    if pre
      li.push ''.padEnd(pre_indent)+"if null #"+pre.trim()
      pre = 0

    if s.startsWith ':'
      pos = s.search /\s/
      if ~pos
        li.push ''.padEnd(indent)+'$|' + s[pos..]
      else
        pre_indent = indent
        pre = line
    else
      indent = ''.padEnd indent
      c0 = s.charAt(0)
      if (
        s.startsWith('@->') or (
          s.startsWith('@(') and s.endsWith(')->')
        )
      )
        li.push indent+'constructor:'+s[1..]
      else if s.startsWith '< class '
        li.push indent+'export'+s[1..]
      else if (~ '+<'.indexOf(c0)) and ' ' == s.charAt(1)
        pos = s.indexOf('=>')
        if pos < 0
          pos = s.indexOf('->')
          if pos < 0
            pos = s.indexOf('{')
            if pos < 0
              pos = s.indexOf('new ')
              if pos < 0
                pos = s.indexOf '['

        if pos > 0
          _export = 'export '

          eqp = s.indexOf('=')

          if (eqp < 0) or (eqp == pos)
            _export += 'default '
          else
            argp = s.indexOf '('
            if argp > 0 and eqp > argp
              _export += 'default '

          li.push _export+s[1..].trimStart()
        else
          s = s[2..].split(',').map((i)=>i.trim()).filter(Boolean)
          for i in s
            pos = i.indexOf('=')
            if pos < 0
              i += '=`undefined`#'+c0
            if c0 == '<'
              i = 'export '+i
            li.push indent+i
      else
        for word from ['break ','continue ']
          if s.startsWith(word)
            li.push line.replace(word,'`'+word)+'`'
            `continue OUT`
        li.push line

  li.join '\n'


label = (code)=>
  li = []
  code = code.split('\n')
  if code[0] == '//!/usr/bin/env coffee'
    li.push '#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict'
    code = code[1..]
  for line in code
    s = line.trimStart()
    indent = line.length - s.length
    push = (txt)=>
      li.push ''.padEnd(indent)+txt
      return
    if s.startsWith('export var ') and s.endsWith('=> {')
      li.push 'export const'+s[10..]
    else if s.endsWith ' = undefined; //+'
      continue
    else if s.endsWith ' = undefined; //<'
      li.push line[..-18]+';'
    else if s.startsWith 'if (null) { //:'
      push s[15..]+' : {'
    else if s.startsWith '$ | ('
      s = s[4..]
      if s.indexOf('function(') > 0 or s.indexOf('=>') > 0
        txt = s
      else
        txt = s[1...-2]+';'
      push '$ : '+txt
    else if s.startsWith '(() => { //:'
      push s[12..]+' : ({'
    else
      li.push line
  li.join('\n')


export coffee_plus = (CoffeeScript)=>
  {compile} = CoffeeScript
  compile.bind CoffeeScript
  (code, ...args)=>
    code = coffee_label gt_import code.split("\n")
    r = compile code,...args
    if typeof(r) == 'string'
      return label(r)
    else
      r.js = label(r.js)
      return r

export default (CoffeeScript)=>
  CoffeeScript.compile = coffee_plus CoffeeScript
