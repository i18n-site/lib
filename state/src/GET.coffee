> @3-/cw/Res.js
  ./MySql.js
  js-yaml > load

export default ({url, headers},env,ctx)=>
  {
    STATE_PASSWORD
    STATE_USER
    STATE_PORT
    STATE_HOST
    STATE_DB
    IPV4
  } = env

  state_conn = await MySql(
    STATE_HOST
    STATE_PORT
    STATE_USER
    STATE_PASSWORD
    {
      ssl:
        rejectUnauthorized: false
      database: STATE_DB
    }
  )
  console.log await state_conn.query 'show tables'

  {
    MYSQL_PASSWORD
    MYSQL_USER
    MYSQL_PORT
    IPV4
  } = env

  err_li = []

  err = (host_li, msg)=>
    if Array.isArray(host_li)
      host_str = host_li.join(' & ')
    else
      host_str = host_li
      host_li = [host_li]
    err_li.push [host_li, msg]
    console.error(host_str, msg)
    return

  host_ipv4 = load IPV4
  ipv4_host = new Map
  Object.entries(host_ipv4).forEach ( [k,v] ) =>
    ipv4_host.set v, k
    return

  slave_li = []
  master_set = new Set
  host_li = env.MYSQL_HOST_LI.split(' ')

  rli = await Promise.allSettled(
    host_li.map (host)=>
      console.log host
      conn = await MySql(
        host_ipv4[host]
        MYSQL_PORT
        MYSQL_USER
        MYSQL_PASSWORD
        {
          ssl: false
        }
      )

      q = (args...)=>
        (await conn.query(...args))[0]

      q1 = (args...)=>
        (await q(...args))[0]

      read_only = (await q1 'SELECT @@read_only')['@@read_only']

      state = await q1('SHOW SLAVE STATUS')
      if not state
        master_set.add host
        if read_only
          err host, 'master is read-only'
        return

      if not read_only
        err host, 'slave is not read-only'

      {
        Slave_IO_Running
        Slave_SQL_Running
        Last_Error
        Master_Host
      } = state

      slave = [host, ipv4_host.get(Master_Host) or Master_Host]
      if not (
        Slave_IO_Running == 'Yes' and Slave_SQL_Running == 'Yes'
      )
        err host, {
          Slave_IO_Running
          Slave_SQL_Running
          Last_Error
        }

      slave_li.push slave
      return
  )

  rli.forEach (i,pos)=>
    if i.status != 'fulfilled'
      err host_li[pos], i.reason
    return

  master_li = [...master_set]
  len = master_li.length
  if len > 1
    err master_li, 'multiple master '
  else if len == 0
    err slave_li,'no master'

  return [
    master_li
    slave_li.map ([host, master])=>
      if not master_set.has master
        err host, 'slave master '+master+' != '+master_li.join(' / ')
      host
    err_li
  ]
