#!/usr/bin/env coffee

< (client, reply, func)=>
  wait_id = (
    await reply '开始处理，请等待 3-5 分钟…'
  ).data.message_id
  try
    return await func()
  finally
    await client.im.v1.message.delete({
      path: {
        message_id: wait_id
      }
    })
  return
