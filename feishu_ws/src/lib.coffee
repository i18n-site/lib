#!/usr/bin/env coffee

> ./conn.js
  ./wrap.js

export default (appId, appSecret, parse, option={})=>
  conn(
    {
      appId
      appSecret
    }
    wrap(parse)
    option
  )
