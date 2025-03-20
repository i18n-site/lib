#!/usr/bin/env coffee

> path > join dirname
  @alicloud/tea-util > RuntimeOptions
  @alicloud/openapi-client:OpenApi > Config
  @3-/uridir

DIR = dirname uridir(import.meta)

{
  ALIYUN_accessKeyId: accessKeyId
  ALIYUN_secretAccessKey: accessKeySecret
} = process.env

< (mod, name) =>
  {default:_mod} = mod
  runtime = new RuntimeOptions {}

  cas = new _mod(
    new Config({
      endpoint: name+'.aliyuncs.com'
      accessKeyId
      accessKeySecret
    })
  )

  bind = (name,k)=>
    func = cas[name+'WithOptions']
    req = mod[k]
    (o)=>
      r = await func.call(
        cas
        new req o
        runtime
      )
      r.body

  r = {}
  for [k,v] from Object.entries(mod)
    if k.endsWith 'Request'
      name = k[0].toLowerCase()+k[1..-8]
      r[name] = bind(name,k)
  r
