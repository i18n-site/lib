#!/usr/bin/env coffee

> prexit

export default (CONN)=>
  prexit =>
    Promise.allSettled(
      CONN.map (pg)=>
        await pg.end({ timeout: 9 })
        new Promise (r)=>
          pg.close(r)
          return
    )
  return
