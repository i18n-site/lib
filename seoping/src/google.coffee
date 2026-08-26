#!/usr/bin/env coffee
> googleapis > google
  @3-/chunk

export ping = (access_token, url_li)=>
  ing = []
  for i in chunk(url_li, 100)
    ing.push _ping(access_token, i)
  Promise.allSettled(ing)

_ping = (access_token, url_li)=>
  boundary = 'Xi18nSiteX'
  body = url_li.map (url) ->
      """--#{boundary}
Content-Type: application/http
Content-ID:

POST /v3/urlNotifications:publish HTTP/1.1
Content-Type: application/json

#{JSON.stringify {url,type: 'URL_UPDATED'}}"""
    .join('\n') + "\n--#{boundary}--"
  r = await (
    await fetch(
      # "https://indexing.googleapis.com/v3/urlNotifications:publish"
      'https://indexing.googleapis.com/batch'
      {
        method: 'POST',
        headers: {
          'Content-Type': "multipart/mixed; boundary=#{boundary}"
          Authorization: "Bearer #{access_token}"
        }
        body
      }
    )
  ).text()
  return r

export default (
  client_email
  private_key
)=>
  jwt = new google.auth.JWT(
    client_email
    null
    private_key
    [
      'https://www.googleapis.com/auth/indexing'
    ]
    null
  )

  {
    access_token
  } = await jwt.authorize()
  ping.bind(0,access_token)
