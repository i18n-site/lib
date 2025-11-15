> @7digital/mysql2-timeout > connect
  @3-/yml > load
  @3-/sleep
  @3-/heartbeat:Heartbeat
  zx/globals:

heartbeat = await Heartbeat(
  'mysqlha'
  180
)

$.verbose = true

isRun = ({Slave_IO_Running,Slave_SQL_Running}) =>
  Slave_IO_Running == "Yes" and Slave_SQL_Running == "Yes"

checkSlave = (conn, conf, master_ip, ip, status) =>
  # [{Last_IO_Errno,Gtid_IO_Pos,Master_Host,Master_Port,Slave_IO_Running,Slave_SQL_Running}] = status
  # console.log ip, {
  #   Last_IO_Errno, Gtid_IO_Pos,Master_Host,Master_Port
  #   Slave_SQL_Running,Slave_IO_Running
  # }
  {Master_Host,Master_Port} = status
  if isRun(status) and Master_Host == master_ip and Master_Port == conf.port
    return

  q = (sql)=>
    conn.query {sql,timeout:6e4}

  console.log ip, 'change master'

  await q 'STOP SLAVE'
  await q 'RESET SLAVE ALL'
  await q "CHANGE MASTER TO master_use_gtid=slave_pos,MASTER_USER='#{conf.user}',MASTER_HOST='#{master_ip}',MASTER_PORT=#{conf.port}, MASTER_PASSWORD='#{conf.password}',MASTER_CONNECT_RETRY=1"
  await q 'SET GLOBAL read_only=ON'
  await q 'START SLAVE'
  await $"timeout 3m ssh #{ip} #{conf.sh.ip_master} #{conf.iptable_port} #{master_ip} #{conf.port}"
  return


master2slave = (conf, master, slave_li)=>
  count = new Map
  max = 0
  max_ip = master[0]
  for [conn, ip, status] in slave_li
    host = status.Master_Host
    if master.includes host
      c = (count.get(host) or 0) + 1
      count.set(
        host
        c
      )
      if c > max
        max_ip = host

  for i in master
    if i != max_ip
      await $"timeout 1m ssh #{i} #{conf.sh.slave}"
  return

slave2master = (conf, slave_li)=>
  max_id = -1
  + master
  for [conn, ip, status] in slave_li
    if isRun(status)
      console.log ip, 'has master'
      return
    id = status.Read_Master_Log_Pos
    if id > max_id
      max_id = id
      master = ip
  if not master
    return

  await $"timeout 9m ssh #{master} #{conf.sh.master}"
  return

_watch = (cluster, conf, ing)=>
  conn_li = await Promise.allSettled ing
  ing = []
  for i, pos in conn_li
    ip = conf.ip[pos]
    if i.status == "fulfilled"
      conn = i.value
      ing.push do =>
        [
          conn
          ip
          (await conn.query(sql:'SHOW SLAVE STATUS',timeout:6e3))[0]
        ]
    else
      console.error ip, i.value

  master = []
  slave_li = []
  for i from await Promise.allSettled ing
    if i.status == "fulfilled"
      [conn, ip, status] = i.value
      if status.length == 0
        master.push ip
      else
        [status] = status
        slave_li.push [conn, ip, status]
    else
      console.error i.reason

  console.log '# '+cluster+'\nmaster '+master.join(" ")+'\nslave', slave_li.map(
    (i)=>i[1]
  ).join(' ')
  switch master.length
    when 0
      await slave2master conf, slave_li
    when 1
      await Promise.allSettled slave_li.map ([conn, ip, status])=>
        try
          await checkSlave conn,conf,master[0],ip,status
        catch err
          console.error ip, err
        return
      return
    else
      await master2slave conf, master, slave_li
  return

watch = (cluster, conf)=>
  ing = []
  conn_li = []
  for ip from conf.ip
    ing.push do =>
      try
        conn = await connect {
          host: ip
          port: conf.port
          user: conf.user
          password: conf.password
          connectTimeout: 6e3
          acquireTimeout: 6e3
          defaultQueryTimeout: 6e3
        }
      catch err
        console.error '❌ '+ip+':'+port
        throw err
      conn_li.push conn
      return conn
  try
    return await _watch cluster, conf, ing
  finally
    await Promise.allSettled conn_li.map (conn)=>
      conn.end()
  return

< (yml)=>
  yml = load yml
  ing = []
  n = 0
  loop
    console.log new Date().toISOString().slice(0,19).replace('T',' ')
    for [cluster, conf] from Object.entries yml
      ing.push do =>
        try
          await watch cluster, conf
        catch err
          console.log cluster+' :',err
        return
    await Promise.allSettled ing
    if n++ % 6 == 0
      await heartbeat()
    await sleep 6e3
  return
