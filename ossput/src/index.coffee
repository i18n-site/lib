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

  ###
fix https://www.backblaze.com/
Unsupported header 'x-amz-checksum-crc32' received for this API call.
https://community.cloudflare.com/t/aws-sdk-client-s3-v3-729-0-breaks-uploadpart-and-putobject-r2-s3-api-compatibility/758637/11
  ###
  conf.requestChecksumCalculation = conf.requestChecksumCalculation or 'WHEN_REQUIRED'
  conf.region = conf.region or 'auto'

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
          console.error "@3-/ossput ERROR", conf.endpoint, bucket, params.Key, err
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
    if Key.constructor == String
      o = {
        Key
      }
    else
      o = Key

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
