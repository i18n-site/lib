#!/usr/bin/env coffee

> ./loads.js
  @3-/read
  fs > existsSync

< (fp)=>
  if not existsSync fp
    return
  loads read fp
