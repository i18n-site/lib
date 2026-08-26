#!/usr/bin/env coffee

> oblivious-set > ObliviousSet

< (func)=>
  cache = new ObliviousSet(6e6)
  (client, data)=>
    {
      event_id
    } = data
    if cache.has event_id
      return
    cache.add event_id

    # 5分钟之前的消息不处理
    if (new Date() -  data.message.create_time) > 3e5
      return

    return func client, data
