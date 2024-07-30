#!/usr/bin/env coffee

> @aws-sdk/client-s3 > S3Client
  @aws-sdk/lib-storage > Upload
  @smithy/node-http-handler > NodeHttpHandler
  https-proxy-agent:agent
  util > promisify
  # ./conf.js
  assert > strict:assert

{env} = process
{https_proxy} = env

if https_proxy
  console.log "@3-/ossput use https_proxy",https_proxy
  requestHandler = new NodeHttpHandler({
    httpsAgent: new agent.HttpsProxyAgent(https_proxy)
  })

bind = ([bucket, conf,  url])=>
  conf.region = conf.region or 'us-east-1'
  if requestHandler
    conf.requestHandler = requestHandler

  client = new S3Client conf

  (params, body, tip)=>
    n = 10
    loop
      try
        up = new Upload {
          client
          queueSize: 4
          partSize: 5242880
          leavePartsOnError: false
          params:{
            Bucket: bucket
            Body: body()
            ...params
          }
        }
        up.on(
          'httpUploadProgress'
          ({loaded, total}) =>
            if loaded != total
              msg = [
                bucket
              ]
              if tip
                msg.push tip
              if total
                msg.push Math.round(loaded*10000/total)/100+'%'
              console.log msg.join('  ')
            return
        )
        await up.done()
        break
      catch err
        if --n
          continue
        else
          console.error "@3-/ossput ERROR",conf, params.Key
          throw err
    msg = []
    if tip
      msg.push tip + ' →'
    msg.push url+'/'+params.Key
    console.log msg.join(' ')
    return

# PREFIX = ''

< (li)=>
  # bucket = env[PREFIX+'OSSPUT_BUCKET']
  # assert (!!bucket),'NO ENV OSSPUT_BUCKET'
  # 从环境变量加载配置
  # li = (await conf(bucket, PREFIX)).map bind

  li = li.map bind

  (Key, body, contentType, tip)=>
    o = {
      Key
    }

    if contentType
      o.ContentType = contentType

    await Promise.all li.map (_put)=>
      _put o,body,tip

    return

  # put(...args)

# < reload = (prefix)=>
#   PREFIX = prefix
#   put = _put
#   return
#
# < (args...)=>
#   put(...args)
