#!/usr/bin/env coffee

> @3-/req/reqJson.js

export default (
  client_id
  client_secret
  code, redirect_uri
)=>
  r = await reqJson(
    'https://open.feishu.cn/open-apis/authen/v2/oauth/token'
    {
      method: 'POST'
      body: JSON.stringify(
        {
          grant_type: 'authorization_code'
          client_id
          client_secret
          code
          redirect_uri
        }
      )
    }
  )

  {
    access_token
  } = r
  if not access_token
    throw r
  return access_token
