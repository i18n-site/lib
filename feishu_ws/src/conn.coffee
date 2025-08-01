#!/usr/bin/env coffee

> @larksuiteoapi/node-sdk > WSClient EventDispatcher Client

< (conf, parse)=>
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
    })
  })
  return
