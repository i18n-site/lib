> mariadb > createPool importFile
  assert/strict:assert
  @3-/is_dev:IS_DEV

# https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md

{
  MYSQL_HOST
  MYSQL_USER
  MYSQL_PWD
  MYSQL_PORT
  MYSQL_DB
  MYSQL_COMPRESS
  MYSQL_CONN_LIMIT
  MYSQL_SSL
  # MYSQL_PREPARE_CACHE_LENGTH
} = process.env

CONF = {
  host: MYSQL_HOST
  user: MYSQL_USER
  port: Number.parseInt(MYSQL_PORT) or 3306
  database: MYSQL_DB
  password: MYSQL_PWD
}

if MYSQL_SSL
  CONF.ssl = JSON.parse(MYSQL_SSL)

if MYSQL_COMPRESS
  CONF.compress = true

if IS_DEV
  {default:ERR} = (await import('@3-/log/ERR.js'))
  {default:GRAY} = (await import('@3-/log/GRAY.js'))
  logger = {
    query: (msg)=>
      GRAY msg.slice(7)
      return
    error: (msg)=>
      ERR(msg)
      return
  }
else
  logger = {}

POOL = createPool({
  connectionLimit: Number.parseInt(MYSQL_CONN_LIMIT) or 8
  acquireTimeout: 19999
  connectTimeout: 6999
  bigIntAsNumber: true
  # charset: 'binary'
  # collation: { index: 63, name: 'BINARY', charset: 'binary' },
  # prepareCacheLength: +MYSQL_PREPARE_CACHE_LENGTH or 0
  logger
  ...CONF
})

< $import = (file)=>
  importFile({
    file
    ...CONF
  })

conn = =>
  POOL.getConnection()

< $ = (func)=>
  new Promise (resolve, reject)=>
    try
      c = await conn()
      resolve await func(c)
    catch err
      reject err
    finally
      c?.release()
    return

export conv = (args)=>
  args.map (i)=>
    if i instanceof Uint8Array
      i = Buffer.from(i)
    i

< $e = (sql, args...)=>
  $(
    (c)=>
      c.execute(
        sql
        conv args
      )
  )

< $q = (sql, args...)=>
  $ (c)=>
    c.query(
      {
        sql
        rowsAsArray: true
      }
      conv args
    )

< $li0 = (sql, args...)=>
  r = await $q(sql, args...)
  r.map (i)=>i[0]

< $row = (sql, args...)=>
  r = await $q(sql, args...)
  r[0]

< $one = (sql, args...)=>
  r = await $row(sql, args...)
  r?[0]

export $vId = new Proxy(
  {}
  {
    get: (_,name) =>
      sql = "SELECT #{name}(?)"
      (v)=>
        $one(sql,v)
  }
)
