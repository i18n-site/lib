#!/usr/bin/env coffee

{ TOKEN, ID } = process.env

api = (url, opt = {}) ->
  opt.headers =
    'X-Auth-Key': TOKEN
    'X-Auth-Email': 'i18n.site@gmail.com'
    # 'Authorization': "Bearer #{TOKEN}"
    'Content-Type': 'application/json'

  if opt.body
    opt.body = JSON.stringify(opt.body)

  console.log opt
  response = await fetch(url, opt)
  data = await response.json()
  data

worker = 'v'

exist = await api "https://api.cloudflare.com/client/v4/accounts/#{ID}/workers/services/#{worker}/environments/production/bindings"


console.log exist
process.exit()

url = "https://api.cloudflare.com/client/v4/accounts/#{ID}/workers/scripts/#{worker}/secrets"


console.log await api(
  url
  {
    method: "PUT"
    body:{
      name:"XXXABC"
      text:"${secretValue}"
      type:"secret_text"
    }
  }
)

# # 定义函数获取所有域名
# listDomains = (accountId) ->
#   url = "https://api.cloudflare.com/client/v4/zones"
#   data = await api(url)
#   data
#
# # 定义函数获取域名的Cache Reserve Writes状态
# getCacheReserveWritesStatus = (accountId) =>
#   zones = await listDomains(accountId)
#   console.log zones
#   for zone in zones.result
#     url = "https://api.cloudflare.com/client/v4/zones/#{zone.id}/argo/tiered_caching"
#     r = await api(url,{
#       method: "PATCH",
#       body:{value: "on"}
#     })
#     console.log zone.name, r
#     # url = "https://api.cloudflare.com/client/v4/zones/#{zone.id}/cache/cache_reserve"
#     # r = await api(url)
#     # if r.success
#     #   if r.result.value == 'on'
#     #     console.log zone.name, r.result.value
#     # else
#     #   console.log zone.name, r.errors.message
#     # console.log "域名: #{zone.name}, Cache Reserve Writes: #{cacheData.result.writes}"
#   return
# await getCacheReserveWritesStatus(ID)
#
