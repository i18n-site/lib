#!/usr/bin/env coffee

> ./conn.js
  ./wrap.js

{
  FEISHU_APP_ID
  FEISHU_APP_SECRET
} = process.env

export default (parse)=>
  conn(
    {
      appId: FEISHU_APP_ID
      appSecret: FEISHU_APP_SECRET
    }
    wrap(parse)
  )
