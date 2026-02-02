#!/usr/bin/env coffee

> @hono/node-server > serve

export default (app)=>
  port = process.env.PORT || 5555

  console.log 'http://127.0.0.1:' + port

  server = serve {
    port
    fetch: app.fetch
  }

  # graceful shutdown
  process.on(
    'SIGINT'
    =>
      server.close()
      process.exit(0)
      return
  )

  process.on 'SIGTERM', =>
    server.close (err) =>
      if err
        console.error(err)
        process.exit(1)
      process.exit(0)
      return
    return

  return
