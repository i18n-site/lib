> @3-/req/reqTxt.js

export default (key,mail)=>
  new Proxy(
    {}
    get:(_, method)=>
      (suffix, body)=>
        api_url = "https://api.cloudflare.com/client/v4/"+suffix
        data = {
          method
          headers: {
            'X-Auth-Key': key
            'X-Auth-Email': mail
            'Content-Type': 'application/json'
          }
        }
        if body
          data.body = JSON.stringify(body)
        text = await reqTxt(
          api_url
          data
        )
        try
          r = JSON.parse(text)
        catch
          throw new Error('NOT JSON:' + text)

        if r.success
          return r.result
        throw new Error(r.errors[0].message)
        return
  )
