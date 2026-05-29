#!/usr/bin/env coffee

> @3-/req/reqJson.js

< (access_token, prefix='https://open.feishu.cn/')=>
  reqJson(
    prefix+'open-apis/authen/v1/user_info'
    {
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    }
  )
