#!/usr/bin/env coffee

> ./index.js > dump load
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
