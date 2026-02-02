#!/usr/bin/env coffee

import camel from '@3-/camel'
import {upperFirst} from 'lodash-es'

CamelCase = (x)=>
  r = camel(x)
  if r != x
    upperFirst r
  else
    x

_mod_name = (i, convert=CamelCase)=>
  pos = i.lastIndexOf ':'
  if pos < 0
    name = i.split('/').pop()
    dot = name.lastIndexOf '.'
    if dot > 0
      ext = name[dot+1..]
      if ~ ['css','styl'].indexOf(ext)
        name = ''
      else
        name = name[...dot]
    return [convert(name),i]
  else
    return [i[pos+1..],_buildin(i,pos)]

_import_line = (code)->
  [name, mod] = _mod_name code
  if name
    """import #{name} from '#{mod}'"""
  else
    """import '#{mod}'"""

hash = '#'
BUILDIN = ['bun','npm','node']

_buildin = (mod, pos)=>
  _mod = mod[...pos]
  if BUILDIN.indexOf(_mod) < 0
    _mod
  else
    mod

_import = (bk)->
  for li from bk
    if li.charAt(0) == hash
      yield li
      continue
    li = li[1..].trim()
    if li
      if li.startsWith(hash)
        yield li
        continue
      pos = li.lastIndexOf hash
      if pos > 0
        li = li[...pos].trimEnd()
      li = li.split(' ')
      gt_pos = li.indexOf('>')
      if gt_pos > 0
        import_li = li[...gt_pos-1]
      else
        import_li = li

      r = import_li.map _import_line

      if gt_pos > 0
        mod = li[gt_pos-1]
        pos = mod.lastIndexOf ':'
        if pos > 0
          rename = mod[pos+1..]
          mod = mod[...pos]
          if BUILDIN.indexOf(mod) < 0
            if rename == '@'
              rename = mod.split('/').pop().split('.')[0]
              rename = CamelCase rename
            r.push "import #{rename} from '#{mod}'"

        func_li = []
        for i in li[gt_pos+1..]
          [rename, func] = _mod_name i,(x)=>x
          if rename == func
            func_li.push func
          else
            func_li.push "#{func} as #{rename}"

        if func_li.length > 0
          r.push "import {#{func_li.join(',')}} from '#{mod}'"

      yield r.join(';')
    else
      yield ''
  return

export default (code)->
  in_gt = false
  bk = []
  for i from code
    trim = i.trimEnd()
    if trim
      if i.startsWith '>'
        in_gt = true
        bk.push i
      else if in_gt
        if i.charAt(0) != ' '
          in_gt = false
          yield from _import bk
          bk = []
          yield i
        else
          bk.push i
      else
        yield i
    else
      yield i
  if bk.length
    yield from _import bk
