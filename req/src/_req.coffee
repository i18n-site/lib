TIMEOUT = 30000

< defaultTimeout = (ms)=>
  TIMEOUT = ms
  return

export default (url, option)=>
  ctrl = new AbortController()

  opt = {
    signal: ctrl.signal
    ...option
  }
  if option
    {timeout} = option

  timer = setTimeout(
    =>
      ctrl.abort()
      return
    timeout or TIMEOUT
  )

  try
    r = await fetch(url, opt)
    switch r.status
      when 200, 301, 304, 404
        return r
    throw r
  finally
    clearTimeout(timer)

  return r

