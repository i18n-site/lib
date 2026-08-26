> @3-/req/reqJson.js
  ./CONST.js > BASE
  ./Feishu.js

export POST = (url, body)=>
  reqJson BASE+url, {
    method: 'POST'
    body
  }

export default (app_id, app_secret)=>
  + tenant_access_token
  url = 'auth/v3/tenant_access_token/internal'
  refresh = =>
    {
      tenant_access_token
      expire
    } = await POST(
      url
      {
        app_id
        app_secret
      }
    )
    next = Math.max(9,(expire - 60))
    # console.log 'refresh after', next/3600, 'hour'
    setTimeout(
      =>
        loop
          try
            await refresh()
            break
          catch err
            console.log url, err
        return
      next*1e3
    )
    return
  await refresh()
  new Feishu(
    =>
      tenant_access_token
  )
