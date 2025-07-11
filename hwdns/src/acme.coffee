> ./index.js > showRecordSetByZone disable enable rm zoneIdByName

ACME_CHALLENGE='_acme-challenge'

< (host)=>
  zoneId = await zoneIdByName(host)
  {recordsets} = await showRecordSetByZone(
    # zoneId, '_acme-challenge', 'CNAME', offset=0
    {
      zoneId
      name: ACME_CHALLENGE
      # type: 'CNAME'
      # offset: 0
      # limit: 100
      # state: 'ACTIVE'
    }
  )

  to_rm = []
  to_enable = []
  for i from recordsets
    {id, name} = i
    if name.endsWith('.')
      name = name.slice(0,-1)
    if name != ACME_CHALLENGE+'.'+host
      continue
    # console.log name, i.type, i.status, i.records
    if i.type == 'CNAME'
      to_enable.push id
      if i.status == 'ACTIVE'
        await disable id
    else
      to_rm.push id
  await rm zoneId,to_rm

  =>
    for i from to_enable
      await enable i
    return
