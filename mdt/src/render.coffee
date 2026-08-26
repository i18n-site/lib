#!/usr/bin/env coffee

> @3-/read
  pug
  path > dirname resolve join
  fs > existsSync

rFp = (path, fp)=>
  dir = dirname fp
  resolve join dir, path

_read = (path)=>
  if existsSync path
    return read(path).trimEnd()
  else
    console.warn '⚠️', path, 'FILE NOT EXIST'
  return

render = {
  '+':(path, fp)=>
    txt = _read rFp path, fp
    txt or path

  pug:(path, fp)=>
    txt = _read rFp path, fp
    if txt
      txt = pug.compile(txt)()
    txt or path
}

< (fp)=>
  md = read fp
  li = []
  for line from md.split '\n'
    line = line.trimEnd()
    trimStart = line.trimStart()
    if trimStart.startsWith('<') and line.endsWith('>')
      p = trimStart.indexOf(' ',2)
      if ~ p
        tag = trimStart[1...p]
        if tag of render
          line = await render[tag] trimStart[p..-2].trim(), fp
    li.push line
  li.join '\n'

