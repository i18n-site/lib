#!/usr/bin/env coffee

> @larksuiteoapi/node-sdk > messageCard

docId = (url)=>
  i = url.split('/').pop()
  i.split('?')[0]

urlLi = (text) =>
  httpsRegex = /https:\/\/\S+/g
  text.match(httpsRegex) or []

export default (fmt)=>(client, data) =>
  {
    message: {
      message_id
      content
    }
    sender: {
      sender_id: {
        open_id
      }
    }
  } = data

  # 回复消息, event_id 貌似不变
  reply = (text)=>
    client.im.v1.message.reply({
      path: {
        message_id
      }
      data: {
        # reply_in_thread: true
        content: JSON.stringify {
          text
        }
        msg_type: 'text'
      }
    })

  replyErr = (text)=>
    reply '❌ 出错了: ' + text

  content = JSON.parse content

  {
    text
  } = content

  refmt = (name, txt)=>
    wait_id = (
      await reply '开始处理，请等待 3-5 分钟…'
    ).data.message_id
    try
      return await fmt(client, reply, name, txt, open_id)
    finally
      await client.im.v1.message.delete({
        path: {
          message_id: wait_id
        }
      })
    return

  if text
    li = urlLi text
    if not li.length
      await replyErr '无法解析 ( 请发送 飞书文档链接 或 上传txt/md )'
      return
    for url from li
      document_id = docId url
      try
        r = await client.docx.v1.document.rawContent({
          path: {
            document_id
          }
        })
        {content} = r.data
        await refmt(content.split('\n')[0],content)
      catch err
        console.error err
        await replyErr err + '\n' + url
  else
    {
      file_name
      file_key
    } = content
    if file_name
      ext = file_name.slice(file_name.lastIndexOf('.')+1)
      if not [
        'txt'
        'md'
      ].includes ext
        await replyErr '无法解析'+file_name+', 请发送纯文本文件(后缀名 .txt 或 .md)'
        return
      res = await client.im.v1.messageResource.get {
        path: {
          file_key
          message_id
        }
        params:
          type: 'file'
      }
      result = ''
      for await chunk from res.getReadableStream()
        result += chunk
      await refmt file_name.slice(0, -1-ext.length), result
    else
      await replyErr '无法解析'
  return
