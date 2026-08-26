#!/usr/bin/env coffee

> hono > Hono

export default app = new Hono()

# app.post(
#   '/'

app.use(
  '*'
  ({ req }, next) =>
    console.log req.header()
    console.log await req.text()
    # text('')
    await next()
)
