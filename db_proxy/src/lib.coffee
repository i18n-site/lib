> @3-/dbq > $q
  @3-/net/ntoa.js
  https-proxy-agent > HttpsProxyAgent
  axios

HOST_PORT = new Map

refresh = =>
  for [host, port] from await $q(
    'SELECT ip,port FROM proxy ORDER BY ts DESC'
  )
    HOST_PORT.set host, port
  return

setInterval refresh, 900000

await refresh()

hostPortIter = ->
  loop
    for i from HOST_PORT.entries()
      yield i
  return

_HOST_PORT_ITER = hostPortIter()

export retry = (method, url,...args)=>
  option = args.pop()
  max_retry = HOST_PORT.size + 50
  while --max_retry > 0
    [host_int, port] = _HOST_PORT_ITER.next().value
    host = ntoa(host_int)
    try
      r = await axios[method](
        url
        ...args
        {
          httpsAgent: new HttpsProxyAgent({host, port})
          signal: AbortSignal.timeout(option.timeout or 30000)
          proxy: false
          ...option
        }
      )
      if [ 200, 301, 304, 404 ].includes(r.status)
        return r.data
      throw r
    catch e
      HOST_PORT.delete(host_int)
      if HOST_PORT.size == 0
        await refresh()
      response = e?.response
      if response
        msg = response.status + ' ' + response.statusText
      else
        msg = e.toString()
      console.warn(
        'PROXY', host+':'+port
        method, url
        msg
      )
  return

export get = (url, option={})=>
  retry('get',url, option)

export post = (url, data, option={})=>
  retry('post',url, data, option)
