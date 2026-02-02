> @3-/dbq > $q $vId
  @3-/time/sec
  @3-/default:

{
  argId
  hostId
} = $vId


< argId
< hostId

idVMap = (table, id_set)=>
  new Map await $q("SELECT id,v FROM #{table} WHERE id IN (#{
    [...id_set].join(',')
  })")


_ping = (id, arg, err, duration, warnErr)=>
  return

update = (id, kind_host, dns_type, host, arg, err, duration, warnErr, kindName)=>
  # await $e(
  #   "UPDATE watch SET err=?,duration=?,warnErr=? WHERE id=?",
  #   err, duration, warnErr, id
  # )
  dns_type = 'IPV'+dns_type
  console.log {
    kindName
    dns_type
    host
    id, err, duration, warnErr
  }
  return

ping = (id, kind_host, dns_type, host, suffix, err, duration, warnErr, kindName)=>
  arg = kind_host+'/'+dns_type+'/'+host+suffix
  err += 1
  try
    await _ping(arg)
    -- err
  catch err
    console.error(err)
  finally
    update(id, kind_host, dns_type, host, arg, err, duration, warnErr, kindName)
  return

< =>
  now = sec()

  kind_set = new Set
  host_set = new Set
  arg_set = new Set

  li = await $q('SELECT id,host_id,kind_id,dns_type,err,arg_id FROM watch WHERE ts<=?', now)
  if not li.length
    return

  for [
    id,host_id,kind_id,dns_type,err,arg_id
  ] from li
    kind_set.add kind_id
    host_set.add host_id
    if arg_id
      arg_set.add arg_id

  kind_li = await $q("SELECT id,host_id,duration,warnErr,v FROM kind WHERE id IN (#{
    [...kind_set].join(',')
  })")

  kind_map = new Map
  for i from kind_li
    host_set.add i[1]
    kind_map.set i[0],i.slice(1)

  host_v = await idVMap 'host', host_set
  arg_v = await idVMap 'arg', arg_set

  ing = []
  for [id,host_id,kind_id,dns_type,err,arg_id] from li
    kind = kind_map.get kind_id
    kind_host = host_v.get kind[0]
    host = host_v.get host_id

    ing.push ping(
      id
      kind_host
      dns_type
      host
      if arg_id then '/'+arg_v.get(arg_id) else ''
      err
      ...kind.slice(1) # duration, warnErr, kindName
    )
  # console.log id,host_id,kind_id,dns_type,ts,err,arg_id
  Promise.allSettled ing
