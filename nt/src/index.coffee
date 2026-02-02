#!/usr/bin/env coffee

> ./dump.js
  ./load.js
  path > join
  fs > existsSync

EXT = '.nt'

< (dir)=>
  new Proxy(
    {}
    get:(_, file)=>
      load join dir, file+EXT

    set:(_, file, val)=>
      dump(
        join(
          dir, file+EXT
        )
        val
      )
      return val
  )
