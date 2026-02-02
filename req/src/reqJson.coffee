#!/usr/bin/env coffee

> ./retry.js
  ./req.js
  lodash-es/merge.js

export default (url,option)=>
  r = await req(
    url
    merge(
      {
        headers:
          "content-type": "application/json"
      }
      option or {}
    )
  )

  if r.status == 200
    try
      return await r.json()
    catch err
      console.error err
  throw r
