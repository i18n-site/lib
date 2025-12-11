#!/usr/bin/env coffee

< (func, limit=20)->
  page = 0
  loop
    r = await func(++page,limit)
    yield from r
    if r.length < limit
      break
  return
