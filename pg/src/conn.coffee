#!/usr/bin/env coffee

> postgres
  prexit

CONN = []

prexit =>
  Promise.allSettled(
    CONN.map (pg)=>
      await pg.end({ timeout: 9 })
      new Promise (r)=>
        pg.close(r)
        return
  )

< (uri, opt)=>
  pg = postgres(
    uri
    {
      idle_timeout: 30
      prepare: true
      ...opt
    }
  )
  CONN.push pg
  pg
