#!/usr/bin/env coffee

> @3-/fetch/fJson.js:_fJson
  @3-/fetch/timeout.js
  @3-/retry

fJson = timeout(
  _fJson
  6e3
)
# 阿里云公共DNS安全传输服务介绍（DoH/DoT）https://alidns.com/articles/6018321800a44d0e45e90d71

TYPE = {
  AAAA: 28
  A: 1
}

SRV = [
  # 'dns.alidns.com/resolve'
    '223.5.5.5/resolve'
    '223.6.6.6/resolve'
  'dns.pub/dns-query'
  'dns.google/resolve'
]
SRV.sort(=>0.5 - Math.random())

doh = (url, type)=>
  r = []

  result = await fJson url
  {Answer} = result
  if Answer
    for i in Answer
      if i.type == type
        r.push i.data
  else
    throw new Error("No Answer : "+JSON.stringify(result))
  r = [...new Set(r)]
  r.sort()
  return r

export default main = (type, name, edns_client_subnet)=>
  options = {
    type
    name
  }
  if edns_client_subnet
    options.edns_client_subnet = edns_client_subnet

  params = '?'+new URLSearchParams options
  type_id = TYPE[type]
  SRV.push(SRV.shift())

  for i from SRV
    url = 'https://'+i+params
    console.log url
    try
      r = await doh(url, type_id)
      return r
    catch err
      console.error url, err
  throw err
  return

# if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
#   name = 'i18n.site.s2-web.dogedns.com'
#   for type in 'A AAAA'.split(' ')
#     console.log await main(
#       name
#       type
#     )
#   process.exit()
