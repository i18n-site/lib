#!/usr/bin/env coffee

> @3-/write
  path > join
  ./nodeModules.js


export default (ROOT)=>
  STYL = []

  exist = new Set

  for i from nodeModules(
    ROOT
    [
      'index.css'
      'index.styl'
    ]
  )
    STYL.push i

  console.log '\n# styl\n'+STYL.join '\n'

  li = []
  for i from STYL
    t = "@require '#{i}'"
    if i.endsWith '.css'
      # for fix @import must precede all other statements (besides @charset or empty @layer)
      li.unshift t
    else
      li.push t

  write(
    join ROOT,'src/styl/plugin.styl'
    li.join '\n'
  )
  return

