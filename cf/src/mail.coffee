#!/usr/bin/env coffee

> @3-/cf:CF

TXT = 'TXT'
MX = 'MX'

< (host, conf)=>
  for {id} from await CF.GET('?name='+host)
    dns_url = "#{id}/dns_records"
    for type from ['MX','TXT']
      url = dns_url + '?type='
      try
        li = await CF.get(url+type)
      catch err
        console.log err
        continue
      for {name,id,type,content} from li
        if name == host or '_dmarc.'+host == name
          console.log 'rm',type,name,content
          # 'https://dash.cloudflare.com/api/v4/zones/f71f83890a81b1649fd4e58eb741ffbc/dns_records/86f5a176dbfd0586066f3e501c75add5'
          await CF.DELETE(
            dns_url+'/'+id
          )

    to_create = []

    to_create.push(
      content: conf.DMARC
      name: '_dmarc.'+host
      type: TXT
    )

    for i,pos in conf.TXT
      to_create.push(
        content: i
        name: host
        type: TXT
      )

    for i,pos in conf.MX
      to_create.push(
        content: i
        name: host
        type: MX
        priority: (pos+1)*5
      )

    await Promise.all to_create.map (opt)=>
      console.log 'new',opt.type,opt.name,opt.content
      CF.post(dns_url, opt)
  return
