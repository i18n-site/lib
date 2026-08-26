#!/usr/bin/env coffee

> postgres
  ./prexit.js

CONN = []

prexit CONN

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
