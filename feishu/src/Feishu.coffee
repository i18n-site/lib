#!/usr/bin/env coffee

> ./CONST.js > BASE
  ./Folder.js
  ./fileTxt.js
  @3-/req/reqTxt.js
  @3-/utf8/utf8e.js
  @3-/sleep

apiReq = (url, conf)->
  txt = await reqTxt BASE+url, conf

  try
    json = JSON.parse txt
  catch err
    console.error txt
    throw err
  {
    code
    msg
    data
  } = json
  if code
    throw new Error code + ': ' + msg
  return data

urlParam = (url, param)->
  if param
    url = url + '?' + new URLSearchParams(param).toString()
  url

export default class Feishu
  constructor: (@token)->

  importMd: (parent_node, file_name, md)->
    file_token = await @uploadTxt(parent_node, file_name+'.md', md)
    {
      ticket
    } = await @post(
      'drive/v1/import_tasks'
      {
        file_extension: 'md'
        file_token
        type: 'docx'
        file_name
        point:
          mount_type: 1
          mount_key: parent_node
      }
    )

    + token

    loop
      await sleep 2e3
      {
        job_error_msg
        job_status
        token
      } = (
        await @get('drive/v1/import_tasks/'+ticket)
      ).result
      if job_status == 0
        break
      if job_status > 2
        throw new Error job_error_msg

    await @rm({token:file_token, type:'file'})
    return token

  uploadTxt: (parent_node, file_name, txt)->
    file = new File [utf8e(txt)], file_name
    @upload(parent_node, file_name, file)

  upload: (parent_node, file_name, file)->
    body = new FormData()
    for [k,v] from Object.entries {
      file
      file_name
      parent_type: 'explorer'
      parent_node
      size: file.size
    }
      body.append(k,v)

    {
      file_token
    } = await apiReq('drive/v1/files/upload_all', {
      ...@reqconf()
      body
      method: 'POST'
    })

    return file_token

  msgTxt: (type, receive_id, text)->
    @post(
      'im/v1/messages?receive_id_type=' + type
      {
        receive_id
        msg_type: 'text'
        content: JSON.stringify {
          text
        }
      }
    )

  msgTxtChat: (receive_id, text)->
    @msgTxt('chat_id', receive_id, text)

  folder: (folder_token)->
    new Folder @, folder_token

  shortcut: (folder_token, refer_token, refer_type)->
    @post 'drive/v1/files/create_shortcut', {
      parent_token: folder_token
      refer_entity: {
        refer_token
        refer_type
      }
    }

  rm: ({token, type})->
    conf = @reqconf()
    conf.method = 'DELETE'
    apiReq(
      'drive/v1/files/' + token + '?type=' + type
      conf
    )


  mv: (file, folder_token)->
    {token, type} = file
    if type == 'shortcut'
      {
        target_token
        target_type
      } = file.shortcut_info
      await Promise.all [
        @shortcut folder_token, target_token, target_type
        @rm file
      ]
      return

    @post 'drive/v1/files/'+token+'/move', {
      folder_token
      type
    }

  fileTxt: (file)->
    fileTxt @, file

  reqTxt: (url, param)=>
    reqTxt BASE+urlParam(url, param), @reqconf()

  reqconf: ->
    {
      headers:
        Authorization: 'Bearer ' + @token()
    }

  post: (url, body)->
    conf = @reqconf()
    conf.method = 'POST'
    if body
      conf.body = JSON.stringify body
    apiReq(url, conf)

  get: (url, param)->
    apiReq urlParam(url, param), @reqconf()
