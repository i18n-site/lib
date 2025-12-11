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
        body instanceof URLSearchParams
      ) or
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
    {status} = r
    if status > 199 and status < 300
      return r

    throw r
  finally
    delete option.signal
  return
