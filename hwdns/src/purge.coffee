#!/usr/bin/env coffee

> ./index.js > zoneIdByName showRecordSetByZone rm

purge = (zoneId, type)=>
  {recordsets} = await showRecordSetByZone(
    # zoneId, '_acme-challenge', 'CNAME', offset=0
    {
      zoneId
      name: ''
      type
      # offset: 0
      # limit: 100
      # state: 'ACTIVE'
    }
  )
  if not recordsets.length
    return
  id_li = []
  for {id, name, records} from recordsets
    console.log name,records
    id_li.push id
  if id_li.length
    await rm(zoneId, id_li)
  await purge(zoneId, type)
  return

export default (host, type_li=['A','AAAA'])=>
  zoneId = await zoneIdByName(host)
  for type from type_li
    await purge(zoneId, type)
  return
