> @neondatabase/serverless > Client

< (env,ctx,func)=>
  pg = new Client(env.PG_URL)
  try
    await pg.connect()
    return await func(pg)
  finally
    ctx.waitUntil(pg.end())
  return
