> @3-/pgw
  ./CONF.js:@ > init:initConf

vpsLiRefreshId = (PG, vps_li)=>
  vps_refresh = new Map await PG"SELECT id,refresh_id FROM cdn.vps_refresh WHERE id IN #{
    PG vps_li.map ([id])=>id
  }".values()
  for i from vps_li
    i.push vps_refresh.get(i[0]) or 0
  return

vpsIdLi = (PG,VPS_LI)=>
  vps_name_li = [...Object.keys VPS_LI]
  vps_id = new Map await PG"SELECT name,id FROM cdn.vps WHERE name IN #{
    PG vps_name_li
  }".values()

  not_exist = []
  vps_li = []
  for i from vps_name_li
    id = vps_id.get i
    if id
      vps_li.push [id,i,VPS_LI[i]]
    else
      not_exist.push i

  for vps from not_exist
    [[id]] = await PG"INSERT INTO cdn.vps (name)VALUES(#{vps}) RETURNING id".values()
    vps_li.push [
      id,vps,VPS_LI[vps]
    ]
  vps_li

< (conf_js)=>
  await initConf(conf_js)
  {default:purge} = await import('./purge.js')
  PG = pgw(
    CONF.PG_URL
    # debug: console.log
  )
###
  .replace(
    # pooler 不会收到 listen 的信息
    '-pooler.', '.'
  )
###
  _refresh = (refresh_id, vps)=>
    if not refresh_id
      return
    [id, name, ip, pre_refresh_id] = vps
    # if refresh_id == 1+pre_refresh_id
    #   id_li = [refresh_id]
    path_li = new Set (await PG"SELECT name FROM cdn.pkg,cdn.refresh r WHERE pkg_id=cdn.pkg.id AND r.id<=#{refresh_id} AND r.id>#{pre_refresh_id}".values()).map(([name])=>name)
    for path from path_li
      await purge(path, ip, name)

    vps[3] = refresh_id
    await PG"INSERT INTO cdn.vps_refresh (id,refresh_id,ts) VALUES (#{id},#{refresh_id},EXTRACT(EPOCH FROM NOW())::bigint) ON CONFLICT (id) DO UPDATE SET refresh_id=EXCLUDED.refresh_id,ts=EXCLUDED.ts; "
    return

  refresh = (refresh_id, vps)=>
    try
      await _refresh(refresh_id, vps)
    catch e
      console.error e
    return


  vps_li = await vpsIdLi(PG,CONF.VPS_LI)
  await vpsLiRefreshId(PG, vps_li)

  pre_time = 0
  await PG.listen(
    'refresh_pkg'
    (id)=>
      ing = []
      for i from vps_li
        ing.push refresh(id, i)
      await Promise.allSettled ing

      now = new Date
      if now - pre_time > 36e5
        global.gc()
        console.log now.toLocaleString(),'RSS', Math.round((process.memoryUsage().rss*100/1048576)/100)+'MB'
        pre_time = now
      return
    =>
      [t] = await PG"SELECT id FROM cdn.refresh ORDER BY ID DESC LIMIT 1".values()
      if not t
        return
      refresh_id = t[0]
      for i from vps_li
        if refresh_id != i[3]
          await refresh(refresh_id, i)
      return
  )
  return

