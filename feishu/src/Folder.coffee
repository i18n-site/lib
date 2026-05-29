#!/usr/bin/env coffee

export default class Folder
  constructor: (@feishu, @token)->
    @dir_cache = new Map

  mvWarn: (receive_id, file, dirname)->
    {feishu} = @
    dir_token = await @mkdir(dirname)
    await feishu.mv file, dir_token
    await feishu.msgTxtChat receive_id, '['+dirname+'](' + 'https://feishu.cn/drive/folder/'+ dir_token + ') : ' + file.url

    return

  mkdir: (name)->
    token = @dir_cache.get(name)
    if token
      return token

    li = name.split('/')
    if li.length > 1
      folder = (await @feishu.folder(await @mkdir(li.shift())))
      await folder.ls()
      token = await folder.mkdir(li.join('/'))
    else
      {
        token
      } = await @feishu.post 'drive/v1/files/create_folder', {
        name
        folder_token: @token
      }
    @dir_cache.set name, token
    return token

  ls: ->
    opt = {
      folder_token: @token
      order_by: 'EditedTime'
      direction: 'DESC'
      page_size: 200
    }
    li = []
    loop
      {
        next_page_token
        files
      } = await @feishu.get(
        'drive/v1/files'
        opt
      )
      for i from files
        if i.type == 'folder'
          @dir_cache.set i.name, i.token
      li = li.concat files
      if next_page_token
        opt.page_token = next_page_token
      else
        break
    return li
