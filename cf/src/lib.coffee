> @8v/curl/cJson.js

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

        r = await cJson(
          api_url
          data
        )

        if r.success
          return r.result
        throw new Error(JSON.stringify(r,null,2))
        return
  )
