#!/usr/bin/env coffee

> @3-/feishu:Feishu
  @3-/sleep

{
  FEISHU_APP_ID
  FEISHU_APP_SECRET
} = process.env

F = await Feishu(
  FEISHU_APP_ID
  FEISHU_APP_SECRET
)

do =>
  folder_token = 'O9GAfNufwloe8GdQmkDc8nRmnXc'
  chat_id = 'oc_835dfa471a1dfb755d636bc1e6f7a2e8'

  folder = await F.folder(folder_token)

  file_li = await folder.ls()
  for i from file_li
    console.log (new Date(1e3*i.created_time)).toISOString().slice(0,4)

  tmp = await folder.mkdir '_'
  console.log tmp

  # console.log await folder.mkdir 'a/b/c'
  # console.log await folder.mkdir 'a/b/c'
  # console.log await folder.mkdir '1'
  # for file from file_li
  #   {
  #     type
  #   } = file
  #   if type == 'folder'
  #     continue
  #   r = await F.fileTxt file
  #   if r
  #     [
  #       name
  #       txt
  #     ] = r
  #     console.log name, txt.length, [txt.slice(0, 30)]
  #   else
  #     await folder.mvWarn(
  #       chat_id
  #       file
  #       '文件格式不支持'
  #     )
  process.exit()
  return
