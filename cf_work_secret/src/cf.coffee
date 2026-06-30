Api = (token, mail, prefix)=>
  new Proxy(
    {}
    {
      get: (_, method, body)=>
        api = (url, body) =>
          opt = opt or {}

          if method != 'GET'
            opt.method = method
            if body
              opt.body = JSON.stringify(body)

          opt.headers =
            'X-Auth-Key': token
            'X-Auth-Email': mail
            'Content-Type': 'application/json'

          response = await fetch(prefix+url, opt)

          data = await response.json()
          if data.success
            return data.result
          err = data.errors[0]
          console.log prefix+url
          err = '❌ '+url + " : \n" + err.message
          throw new Error(err)
          return
    }
  )


export default ([token, mail, account_id, worker],env)=>
  {
    GET
    PUT
    DELETE
  } = Api token, mail, "https://api.cloudflare.com/client/v4/accounts/#{account_id}/workers/"


  worker_secrets = "scripts/#{worker}/secrets"

  console.log '# cloudflare secrets'
  for [name,text] from Object.entries(env)
    console.log 'SET', name
    await PUT worker_secrets,{
      name
      text
      type:"secret_text"
    }

  exist = await GET "services/#{worker}/environments/production/bindings"
  for {name, type} from exist
    if type == 'secret_text'
      if not (name of env)
        console.log 'DELETE',name
        await DELETE worker_secrets+'/'+name
  return
