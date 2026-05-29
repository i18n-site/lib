> @3-/sleep

MAX_RETRY = 9

< (prefix, key_li)=>
  n = 0
  key_len = key_li.length
  key_li.sort( => Math.random() - 0.5 )

  curl = (url, opt)=>
    if opt
      {headers} = opt
    else
      opt = {}

    if not headers
      headers = opt.headers = {}

    `headers['Content-Type'] ??= 'application/json'`
    retry = 0

    loop
      key = key_li[n]
      headers.Authorization = 'Bearer '+key
      n = (n+1)%key_len
      try
        r = await fetch(
          prefix+url
          opt
        )
        {status} = r
        if status == 200
          return r.json()
        else if [401,403,400].includes status
          retry = MAX_RETRY
          console.error prefix+' api key '+key+' '+r.status+' '+r.statusText
          console.error await r.text()
          throw new Error(r)
        else if status == 429
          console.error prefix+' api key '+key+' TOO_MANY_REQUESTS, WAIT 9s'
          try
            console.error await r.text()
          catch err
            console.error err
          await sleep(9e3)
        else
          throw new Error(status+' : '+await r.text())
      catch err
        if ++retry < MAX_RETRY
          console.error retry, prefix+' api key '+key,':', err
          await sleep 9e3
        throw err
    return

  {
    GET: curl
    POST: (url, body, opt={})=>
      opt.body = JSON.stringify(body)
      opt.method = 'POST'
      curl(
        url
        opt
      )
  }
