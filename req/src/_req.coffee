TIMEOUT = 30000

< defaultTimeout = (ms)=>
  TIMEOUT = ms
  return

CONTENT_TYPE = "content-type"

export default (url, option)=>
  `option ??= {}`

  {timeout,body,headers,signal} = option

  if timeout != 0 and not signal
    option.signal = AbortSignal.timeout(timeout or TIMEOUT)

  if body
    if not option.method
      option.method = 'POST'
    if not (
      (
        body instanceof FormData
      ) or
      body.constructor == String or body instanceof Buffer
    )
      option.body = JSON.stringify(body)
      if not headers
        option.headers = headers = {}
      if not (CONTENT_TYPE of headers)
        headers[CONTENT_TYPE] = "application/json"

  try
    r = await fetch(url, option)
    switch r.status
      when 200, 301, 304, 404
        return r

    throw r
  finally
    delete option.signal
  return
