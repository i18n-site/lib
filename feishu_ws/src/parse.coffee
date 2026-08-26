#!/usr/bin/env coffee

> @larksuiteoapi/node-sdk > messageCard
  @3-/u8/u8merge.js
  @3-/utf8/utf8d.js
  @3-/ext:fileExt
  @3-/pdf2txt
  @3-/docx2txt

docId = (url)=>
  i = url.split('/').pop()
  i.split('?')[0]

urlLi = (text) =>
  httpsRegex = /https:\/\/\S+/g
  text.match(httpsRegex) or []

EXT_LI = [
  'txt'
  'md'
  'pdf'
  'docx'
]

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
    if text.constructor == String
      data = {
        content: JSON.stringify {
          text
        }
        msg_type: 'text'
      }
    else
      data = text

    client.im.v1.message.reply({
      path: {
        message_id
      }
      data
    })

  replyErr = (text)=>
    reply '❌ 出错了: ' + text

  content = JSON.parse content

  {
    text
  } = content

  refmt = (name, txt)=>
    return await fmt(client, reply, name, txt, open_id)

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
      ext = fileExt(file_name)
      if not EXT_LI.includes ext
        await replyErr '无法解析'+file_name+' , 支持格式为 : '+EXT_LI.join(' / ')
        return
      result = []
      try
        res = await client.im.v1.messageResource.get {
          path: {
            file_key
            message_id
          }
          params:
            type: 'file'
        }
        for await chunk from res.getReadableStream()
          result.push(chunk)
        result = u8merge(...result)
        switch ext
          when 'pdf'
            result = pdf2txt result
          when 'docx'
            result = await docx2txt result
          else
            result = utf8d(result)
        await refmt file_name.slice(0, -1-ext.length), result
      catch err
        await replyErr file_name+' : '+err
    else
      await replyErr '无法解析'
  return
