#!/usr/bin/env coffee

> @3-/walk
  path > basename
  process > cwd
  ./lib.js:minhtm
  @3-/read
  fs > writeFileSync

await do =>
  for await i from walk(
    cwd()
    (dir)=>
      b = basename dir
      b == 'node_modules' || b[0] == '.'
  )
    p = i.lastIndexOf '.'
    if p > 0
      if ['htm','html'].includes i.slice(p+1)
        writeFileSync(
          i
          await minhtm(read(i))
        )
  return
