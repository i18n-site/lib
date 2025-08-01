# @3-/feishu

[test/main.coffee](./test/main.coffee) :

```coffee
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
  # console.log await F.jsConf(
  #   FEISHU_APP_ID
  # )
  # return

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
```

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。
