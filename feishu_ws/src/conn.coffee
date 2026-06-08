#!/usr/bin/env coffee

> @larksuiteoapi/node-sdk > WSClient EventDispatcher Client Domain

export default (
  conf
  parse
  option={}
)=>
  if conf.domain != Domain.Lark
    conf.domain = Domain.Feishu

  client = new Client(conf)
  ws = new WSClient(conf)

  ws.start({
    eventDispatcher: new EventDispatcher({}).register({
      'im.message.receive_v1': (data) =>
        try
          await parse client, data
        catch e
          console.log data, e
        return
      ...option
    })
  })
  return
