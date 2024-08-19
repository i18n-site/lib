#!/usr/bin/env coffee

> @3-/hwdns > HW create rm showRecordSetByZone zoneIdByName update
  @3-/sleep
  @3-/cdncheck
  @3-/err:Err
  lodash-es > chunk
  @3-/u8/u8eq.js
  ./doh.js
  ./DNS.js:@ > DEFAULT_EDNS

{NoRecordError} = Err

default_view = 'default_view'

recordsByZoneId = (zoneId, name, type, default_host)=>
  exist = new Map
  offset = 0
  limit = 500
  to_rm = []
  loop
    {
      recordsets
      metadata:{
        total_count
      }
    } = await showRecordSetByZone({
      zoneId
      limit
      offset
      type
    })
    offset += limit
    for i from recordsets
      if i.name.slice(0,-1) == name
        {id,line,records} = i
        pre = exist.get(line)
        if pre
          console.log '删除重复线路',line
          to_rm.push id
          continue
        records.sort()
        exist.set(line,[
          id
          records
        ])
    if offset >= total_count
      break
  console.log [
    name
    type+'总记录数 '+ total_count
  ].join('\n')
  await rm(zoneId, to_rm)
  return exist

< (type, name, cname, default_host)=>
  zoneId = await zoneIdByName(name)
  if not zoneId
    console.error name, 'not found'
    return
  result = [type]
  exist = await recordsByZoneId(zoneId, name, type)
  renew = new Set
  ip_set = new Set

  to_update = []
  to_create = []

  _doh = doh.bind(undefined,type)

  add = (line, li)=>
    if li.length
      pre = exist.get(line)
      if pre
        renew.add(line)
        if u8eq(pre[1],li)
          null
          # console.log '✅',line,type,name,li.length
        else
          li = [... new Set [...pre[1],...li]]
          li.sort()
          to_update.push [
            [pre[0],line]
            li
          ]
      else
        to_create.push [
          line
          li
        ]
    return

  global = await _doh(default_host,DEFAULT_EDNS)
  add default_view, global
  global.forEach (i)=>ip_set.add(i)
  ing = []

  for [base_line, sub] from DNS
    add_doh = (line, edns)=>
      add line,await _doh(cname,edns)
      return

    for i from Object.entries sub
      ing.push add_doh(...i)

  await Promise.all ing
  [
    to_create
    to_update
  ].forEach (to_li)=>
    to_li.forEach (x)=>
      for i from x[1]
        ip_set.add i
      return
    return

  ok_ip_li = await cdncheck(name,'.js',[...ip_set])
  if not ok_ip_li.length
    throw new NoRecordError "#{type} #{name} #{cname} #{default_host}"

  for i from ok_ip_li
    console.log i.join('\t')

  for i from ok_ip_li
    console.log i.join('\t')

  ok_ip_li = ok_ip_li.map (i)=>i[0]
  ok_ip = new Set ok_ip_li
  check_failed = ip_set.size - ok_ip.size

  ip_li_limit = 3

  filter_ok_ip = ([line,ip_li])=>
    li = ip_li.filter (i)=>ok_ip.has i
    if not li.length
      return false
    ip_li.splice(0,ip_li.length,...li.slice(0, ip_li_limit))
    if not li.length
      renew.delete line
    # if r
    #   {length} = ip_li
    #   diff = length - ip_li_limit
    #   if diff > 0
    #     ip_li.splice(ip_li_limit,diff)
    # else
    #   renew.delete line
    return true

  add(
    base_line
    ok_ip_li
  )
  to_create = to_create.filter filter_ok_ip
  to_update = to_update.filter ([[id,line],ip_li])=>
    filter_ok_ip([line,ip_li])

  to_update = to_update.filter(
    ([[_,line], li])=>
      pre = exist.get(line)[1]
      not_same = JSON.stringify(li) != JSON.stringify(pre)
      if not_same
        diff = li.length-pre.length
        if diff > 0
          diff = '+'+diff
        console.log type, line, diff
      not_same
  )

  await Promise.all [
    create zoneId, type, name, to_create
    update zoneId, to_update
  ]


  to_rm = []
  for [line,[id]] from exist.entries()
    if renew.has line
      continue
    if line == default_view
      continue
    to_rm.push id
    console.log 'rm line',name,type,line
  await rm zoneId, to_rm

  o = {
    check_failed
  }
  {length} = to_update
  if length
    o.update = length
  {length} = to_create
  if length
    o.create = length
  result.push o
  return result

# console.log JSON.stringify await main()
# process.exit()
