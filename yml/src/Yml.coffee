#!/usr/bin/env coffee

> ./dump.js
  ./load.js
  path > join
  fs > existsSync

< (dir)=>
  new Proxy(
    {}
    get:(_, file)=>
      fp = join dir, file+'.yml'
      if existsSync fp
        return load fp
      return

    set:(_, file, val)=>
      dump(
        join(
          dir, file+'.yml'
        )
        val
      )
      return val
  )
