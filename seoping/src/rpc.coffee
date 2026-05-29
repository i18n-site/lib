#!/usr/bin/env coffee

rpc = (url)=>
  body = """<?xml version=\"1.0\"?>
<methodCall><methodName>weblogUpdates.ping</methodName><params><param><value></value></param><param><value>#{url}</value></param></params></methodCall>"""
  # rpc = 'http://ping.baidu.com/ping/RPC2'
  # rpc = 'http://ping.feedburner.com'
  rpc = 'http://rpc.pingomatic.com'
  r = await fetch(
    rpc
    {
      method: 'POST'
      headers:
        'Content-Type': 'text/xml'
      body
    }
  )
  if r.status != 200
    err = await r.text()
    throw new Error r.status+' : '+err
  r.text()

export default (url_li) =>
  ing = []
  for url from url_li
    ing.push rpc(url)
  Promise.allSettled(ing)

