#!/usr/bin/env coffee

> ./index.js

{
  POST
} = index

< (zone_id, host, files)=>
  POST(
    zone_id+'/purge_cache'
    {
      files
    }
  )

