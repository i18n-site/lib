> ./index.js:CF

< (host)=>
  host_id = (await CF.get('?name='+host))[0].id
  dns_url = host_id+'/dns_records'
  (
    prefix
    ipv4_li
    ipv6_li
  )=>
    if ipv6_li.constructor == String
      ipv6_li = if ipv6_li then [ipv6_li] else []
    if ipv4_li.constructor == String
      ipv4_li = if ipv4_li then [ipv4_li] else []

    ipv4_set = new Set(ipv4_li)
    ipv6_set = new Set(ipv6_li)

    if prefix
      phost = prefix+'.'+host
    else
      phost = host

    for type from ['A','AAAA']
      o = await CF.get(dns_url+'?type='+type+'&name='+phost)
      for {content, id, name} from o
        if type == 'A' and ipv4_set.delete(content)
          continue
        if type == 'AAAA' and ipv6_set.delete(content)
          continue
        await CF.DELETE(dns_url+'/'+id)

    for [type, ip_set] from [
      [
        'A'
        ipv4_set
      ]
      [
        'AAAA'
        ipv6_set
      ]
    ]
      for ip from ip_set
        await CF.POST(
          dns_url
          {
            proxied: true
            content: ip
            name: phost
            type
          }
        )
    return



