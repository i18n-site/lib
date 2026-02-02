#!/usr/bin/env coffee

> @3-/feishu:Feishu
  @3-/feishu/webAuth.js
  @3-/feishu/userInfo.js
  @3-/sleep
  @3-/req/reqJson.js

{
  FEISHU_APP_ID
  FEISHU_APP_SECRET
} = process.env

F = await Feishu(
  FEISHU_APP_ID
  FEISHU_APP_SECRET
)


do =>

  access_token = await webAuth(
    FEISHU_APP_ID
    FEISHU_APP_SECRET
    '2DHgx446wae4AeEA9fx3AAf3Dw2HJ166'
    'https://hrai-feishu.xxx.com/'
  )
  console.log await userInfo(access_token)
  # {
  #   access_token
  # } = r
  # if not access_token
  #   console.error r
  #
  # console.log await reqJson(
  #   'https://open.feishu.cn/open-apis/authen/v1/user_info'
  #   {
  #     headers: {
  #       Authorization: 'Bearer ' + access_token
  #     }
  #   }
  # )
  #
  # console.log await F.ticket()
  # folder_token = 'WTF9fovaklhscEdTbzlcoaernYb'
  # chat_id = 'oc_835dfa471a1dfb755d636bc1e6f7a2e8'
  #
  # folder = await F.folder(folder_token)
  #
  # file_li = await folder.ls()
  # for i from file_li
  #   console.log i
  #   if i.type != 'folder'
  #     console.log await F.userName(i.owner_id)
  #     console.log (new Date(1e3*i.created_time)).toISOString().slice(0,4)

  # tmp = await folder.mkdir '_'
  # console.log tmp
  # console.log await F.importMd(
  #   tmp
  #   'xxx'
  #   '''
  #   下午武切维奇
  #   '''
  #
  # )

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
