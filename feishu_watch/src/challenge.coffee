#!/usr/bin/env coffee

> hono > Hono
  ./run.js

app = new Hono()

# 飞书回调添加验证
app.post '/', ({req,json})=>
  {
    challenge
    token
  } = await req.json()
  console.log {
    challenge
    token
  }
  json {challenge}

run app
