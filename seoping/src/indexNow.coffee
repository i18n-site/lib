> @3-/chunk

_ping = (searchengine, key, host, body)=>
  r = await fetch(
    "https://#{searchengine}/indexnow"
    {
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
      }
      body
    }
  )
  [
    r.status
    await r.text()
  ]

export ping = (searchengine, key, host, urlList)=>
  ing = []
  for i in chunk(urlList, 9999)
    body = JSON.stringify {
      host
      key
      urlList:i
    }
    ing.push _ping(searchengine, key, host, body)
  Promise.allSettled(ing)

###
https://www.indexnow.org/faq
支持 IndexNow 的搜索引擎会立即共享提交给所有其他支持 IndexNow 的搜索引擎的所有 URL，因此您只需通知一个端点即可。
###

SITE_LI = [
  "api.indexnow.org"
  "www.bing.com"
  "yandex.com"
  # "searchadvisor.naver.com"
  # "search.seznam.cz"
  # "indexnow.yep.com"
]

export default (
  key
  host
  urlList
)=>
  err_li = []
  for searchengine from SITE_LI
    li = await ping searchengine, key, host, urlList
    err_n = 0
    for i from li
      {value} = i
      if i.status == 'fulfilled'
        if value[0] != 200
          console.error value[1]
          err_li.push(value[1])
          err_n += 1
      else
        err_li.push(value)
        err_n += 1
    if err_n == 0
      return [ searchengine, li.map((i)=>i.value[1]) ]
  throw new Error JSON.stringify err_li
  return
