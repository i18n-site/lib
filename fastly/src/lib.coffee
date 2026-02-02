> @3-/fetch/fJson.js
  @3-/retry

export purge = retry (token, host, path)=>
  r = await fJson(
    "https://api.fastly.com/purge/#{host}/#{path}"
    method: "POST"
    headers: {
      "Fastly-Key": token
      "fastly-soft-purge": 1
    }
  )
  if r.status != 'ok'
    throw r
  return
