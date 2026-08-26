#!/usr/bin/env coffee

> uuid > v4:uuid
  @3-/req/reqJson.js
  @3-/req/reqTxt.js

export default (
  # { client_id, client_secret, username, password }
  conf
)=>
  body = new FormData()
  body.append('grant_type','password')
  for [k,v] from Object.entries(conf)
    body.append(k,v)
  {
    access_token
  } = JSON.parse(await reqTxt(
    'https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token'
    {
      method: 'POST'
      body:new URLSearchParams body
    }
  ))
  return (url, opt={})=>
    reqJson(
      'https://api.contabo.com/v1/'+url
      {
        headers: {
          'Content-Type': 'application/json'
          Authorization: 'Bearer '+access_token
          'x-trace-id':new Date - 0
          'x-request-id':uuid()
        }
        ...opt
      }
    )
