#!/usr/bin/env coffee

> path > join
  @3-/rm

`export {default as rm} from '@3-/rm'`

< rmPre = (dir)=>
  for p from ['function','table','trigger','procedure']
    rm join dir,p
  return
