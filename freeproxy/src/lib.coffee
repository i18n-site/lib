> @3-/req/reqTxt.js
  @3-/extract/extractLi.js
  @3-/dbq > $e $q
  @3-/pool > Pool
  @3-/sleep
  @3-/nowts
  @3-/txt_li:txtLi
  axios:@ > AxiosError
  fs > readFileSync
  https-proxy-agent > HttpsProxyAgent
  node:assert/strict:assert
  @3-/net/ntoa.js
  @3-/net/aton.js

X_FORWARDED_FOR = 'X-Forwarded-For'

EXIST = new Set

_verify = (host, port)=>
  ip_int = aton(host)
  if EXIST.has ip_int
    return
  else
    EXIST.add ip_int
  ip_port = host+':'+port
  timeout = 10000
  option = {
    httpsAgent: new HttpsProxyAgent({host, port})
    timeout
    signal: AbortSignal.timeout(timeout)
    proxy: false
  }
  r = await axios.get('https://www.taobao.com/robots.txt', option)
  assert r.data.includes('Allow:')
  console.log '>',ip_port

  for i from [
    'https://httpbin.io/headers'
    'https://httpbin.org/headers'
    'https://postman-echo.com/headers'
  ]
    try
      {
        data: {
          headers
        }
      } = await axios.get(i, option)
    catch err
      console.warn 'ERROR', ip_port, i, err?.code
      continue
    for i from [ X_FORWARDED_FOR, X_FORWARDED_FOR.toLowerCase() ]
      forwarded = headers[i]
      if forwarded
        throw new Error(i+' '+forwarded)
    try
      await $e(
        'INSERT INTO proxy (ip, port) VALUES ('+ip_int+','+port+ ') ON DUPLICATE KEY UPDATE ts='+nowts()
      )
      console.log '✅', ip_port, headers
    catch err
      console.warn 'DB ERROR',ip_port, err
    break

  return


verify = ([ip, port])=>
  # console.log ip,port
  try
    await _verify ip, port
  catch err
    if not err instanceof AxiosError
      console.warn ip+':'+port, err
  return

verifyDb = =>
  (
    await $q('SELECT ip,port FROM proxy')
  ).map(
    ([ip,port])=>[ntoa(ip),port]
  )

fetchIsp = (page)=>
  ip_port_li = []
  for i from extractLi(
    '<tr>'
    '</tr>'
    await reqTxt 'https://www.89ip.cn/index_'+page+'.html'
  )
    li = []
    for j from extractLi('<td>', '</td>', i)
      li.push j.trim()
    if li.length == 5
      [ip,port,city,运营商] = li
      if 运营商.includes '阿里'
        continue
      ip_port_li.push li.slice(0,2)
  return ip_port_li

fetch89ip = =>
  n = 0
  li = []
  while ++n < 50
    console.log 'PAGE', n
    try
      li.push(... await fetchIsp(n))
    catch err
      console.warn n, err
      continue
  return li

fetchFreeProxy = =>
  url = 'https://raw.githubusercontent.com/dpangestuw/Free-Proxy/main/http_proxies.txt'
  li = []
  for i from txtLi(
    await reqTxt(url)
  )
    if i.startsWith 'http://'
      li.push i.slice(7).split(':')
  return li

ftxt = (url)=>
  txtLi(
    await reqTxt(url)
  ).map (i)=>i.split(':')

< =>
  ip_port_li_li = [
    verifyDb()
    ftxt 'https://api.proxyscrape.com/v4/free-proxy-list/get?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous,elite&skip=0&limit=2000'
    ftxt 'https://www.proxy-list.download/api/v1/get?type=http&anon=elite'
    ftxt 'https://www.proxy-list.download/api/v1/get?type=http&anon=anonymous'
    fetchFreeProxy()
    fetch89ip()
  ]

  pool = Pool 4096
  for ing from ip_port_li_li
    ing.then(
      (li)=>
        for i from li
          await pool verify, i
        return
      (err)=>
        console.warn err
        return
    )
  await Promise.allSettled ip_port_li_li
  await pool.done
  now = nowts()
  await $e(
    'DELETE FROM proxy WHERE ts<'+(now-86400*7)
  )
  console.log 'done'
  return
