> ./lib.js:fV > ver
  @3-/sleep
  ./B2.js
  ./PG.js
  ./fastly.js > purge:purgeFastly
  @3-/cw/Res.js
  @3-/cw/Token.js

class TooBigError extends Error
  constructor: (size) ->
    super("len > "+size)
    @name = 'TooBig'

MAX_LEN = 512

export default Token ({url, headers},env,ctx,[uid])=>
  pkg = new URL(url).pathname.slice(1)
  v = await ver pkg
  if not v
    return
  {npmv} = env

  exist = await npmv.get(pkg)
  if exist != null
    if await exist.text() == v
      return new Response(
        v
        headers: {
          HIT:''
        }
      )

  bin = await fV pkg,v,'.v'
  # n = 0
  # loop
  #   try
  #     bin = await fV pkg,v,'.v'
  #     break
  #   catch e
  #     if ++n > 9
  #       throw e
  #     if e instanceof Response
  #       if e.status == 404
  #         await sleep n*1e3
  #         continue
  #     throw e

  if bin.length > MAX_LEN
    throw new TooBigError MAX_LEN

  # 上传到 backblaze.com
  await B2(
    env,pkg,bin
    'text/js'
  )

  await Promise.all([
    # 清理 cloudflare 缓存
    purgeFastly(env, pkg)
    PG(
      env
      ctx
      (pg)=>
        pg.query('SELECT cdn.refresh_pkg($1,$2)', [uid, pkg])
    )
  ])

  await npmv.put(
    pkg
    v
  )
  return v
