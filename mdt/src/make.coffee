#!/usr/bin/env coffee

> @3-/walk > walkRel
  @3-/write
  path > resolve basename join
  ./render.js
  ansis > gray

< default main = (dir)=>
  for await i from walkRel(
    dir
    (i)=>
      name = basename(i)
      name == 'node_modules' or  name.startsWith('.')
  )
    if i.endsWith('.mdt')
      fp = join dir, i
      console.log gray fp + ' → ' + i[..-2]
      write(
        fp[..-2]
        "[‼️]: ✏️#{i}\n\n"+await render fp
      )
  return

