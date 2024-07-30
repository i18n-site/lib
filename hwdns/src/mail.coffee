#!/usr/bin/env coffee

> ./index.js > zoneIdByName showRecordSetByZone rm create DEFAULT_VIEW

TXT = 'TXT'
MX = 'MX'
DMARC = '_dmarc.'

< (host,conf)=>
  zoneId = await zoneIdByName host

  li =  await showRecordSetByZone {
    zoneId
    type: 'TXT'
  }

  for i from li.recordsets
    to_rm = []
    name = i.name.slice(0,-1)
    if name == host or name == DMARC+host
      console.log 'rm', i.name, i.type, i.records
      to_rm.push i.id
    await rm zoneId, to_rm

  await Promise.all([
    create(
      zoneId
      MX
      host
      [
        [
          DEFAULT_VIEW
          conf.MX.map (i,pos)=>
            "#{(pos+1)*5} #{i}"
        ]
      ]
    )
    create(
      zoneId
      TXT
      DMARC+host
      [
        [
          DEFAULT_VIEW
          [
            JSON.stringify conf.DMARC
          ]
        ]
      ]
    )
    conf.TXT.map (i)=>
      create(
        zoneId
        TXT
        host
        [
          [
            DEFAULT_VIEW
            [
              JSON.stringify i
            ]
          ]
        ]
      )
  ])
