#!/usr/bin/env coffee

> fs > readdirSync
  path > join basename
  ./lib/parse.js
  @3-/read
  @3-/write

do =>
  评价标准 = '评价标准'
  root = import.meta.dirname
  dir = join(root, 评价标准)
  li = []
  for i from readdirSync dir
    if i.endsWith '.txt'
      li.push '# '+ i.slice(0,-4).replaceAll('-',' / ')
      li.push read(join(dir,i)).split('\n').map(
        (i)=>i.trim()
      ).filter(Boolean).join('\n')

  write(
    join root, 'src/lib.js'
    """
// DON'T EDIT ; GEN BY ../#{basename import.meta.filename}

export default #{JSON.stringify parse li.join('\n\n').trim()}
    """
  )
  return
  # kind_li
