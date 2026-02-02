> mysql2/promise > createConnection
  os > hostname

{
  ALIVE_MYSQL
} = process.env

touch = (vps_id, id, conn, name, duration)=>
  expire = Math.round(
    new Date/1000
  ) + duration

  r = (await conn.query(
    "SELECT id FROM heartbeat WHERE name=? AND vps_id=?"
    [name, vps_id]
  ))[0]
  if r.length
    [{id}] = r
    await conn.query(
      "UPDATE heartbeat SET expire=? WHERE id=?"
      [expire, id]
    )
  else
    id = (await conn.query(
      "INSERT INTO heartbeat SET name=?,expire=?,vps_id=?"
      [name, expire, vps_id]
    ))[0].insertId
  return id

Conn = =>
  createConnection(
      uri:ALIVE_MYSQL
      ssl:
        rejectUnauthorized: false
    )

< (name, duration)=>
  vps = hostname()
  + id

  conn = await Conn()

  r = (await conn.query(
    "SELECT id FROM vps WHERE name=?"
    [vps]
  ))[0]

  if r.length
    [{id:vps_id}] = r
  else
    vps_id = (await conn.query(
      "INSERT INTO vps SET name=?"
      [vps]
    ))[0].insertId
  await conn.end()

  =>
    conn = await Conn()
    try
      id = await touch(vps_id, id, conn, name, duration)
    finally
      await conn.end()
    return
