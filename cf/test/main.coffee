#!/usr/bin/env coffee

> @3-/cf:CF
  @3-/cf/purgeCache.js

# 获取所有域名
# await CF.GET()

# 获取单个域名x
host = 'xxai.eu.org'

{id} = (await CF.GET('?name='+host))[0]

console.log id

console.log await purgeCache(
  id
  host
  [
    "https://#{host}i18n.site/bin/_/v"
  ]
)


# console.log name, id

# https://developers.cloudflare.com/api/operations/zones-post
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

###
https://dash.cloudflare.com/api/v4/accounts/3532021fc25349684e9d77545ec45784/workers/domains/records?zone_id=f71f83890a81b1649fd4e58eb741ffbc

###
# conf = {
#   DMARC: 'v=DMARC1;p=none;rua=mailto:i18n.site@gmail.com'
#   MX: [
#     'mx.mailtie.com'
#   ]
#   TXT: [
#     'mailtie=i18n.site@gmail.com'
#     'v=spf1 include:_spf.google.com ~all'
#   ]
# }
#
# host = 'u-01.eu.org'
# await mail host, conf

# https://dash.cloudflare.com/api/v4/zones/f71f83890a81b1649fd4e58eb741ffbc/dns_records?per_page=50&type=MX&match=all&tag-match=all




  #zone = Zone i.id
  #zone.dns_records()
  # console.log(
  #   await zone['dns_records?type=TXT']
  # )
