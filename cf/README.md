# @3-/cf

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/cf:Cf
  @3-/cf/zone.js

{env} = process

cf = Cf(
  env.CF_KEY
  env.CF_MAIL
)

host = await zone(cf, 'js0.site')
rid = await host.set(
  'CNAME',
  'x'
  'xxx.c.com'
)
console.log rid
console.log 'rm',await host.rmById rid

await host.rmByName '_acme-challenge'
# for await i from host.ls()
#   console.log i

# @3-/cf/purgeCache.js



# # 获取所有域名
# # await CF.GET()
#
# # 获取单个域名x
# host = 'xxai.eu.org'
#
# {id} = (await CF.GET('?name='+host))[0]
#
# console.log id
#
# console.log await purgeCache(
#   id
#   host
#   [
#     "https://#{host}i18n.site/bin/_/v"
#   ]
# )


# console.log name, id

# https://developers.cloudflare.com/api/operations/zones-post
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

###
https://dash.cloudflare.com/api/v4/accounts/3532021fc25349684e9d77545ec45784/workers/domains/records?zone_id=f71f83890a81b1649fd4e58eb741ffbc

###
# conf = {
#   DMARC: 'v=DMARC1;p=none;rua=mailto:i18n.site@gmail.com'
#   MX: [
#     'mx.mailtie.com'
#   ]
#   TXT: [
#     'mailtie=i18n.site@gmail.com'
#     'v=spf1 include:_spf.google.com ~all'
#   ]
# }
#
# host = 'u-01.eu.org'
# await mail host, conf

# https://dash.cloudflare.com/api/v4/zones/f71f83890a81b1649fd4e58eb741ffbc/dns_records?per_page=50&type=MX&match=all&tag-match=all




  #zone = Zone i.id
  #zone.dns_records()
  # console.log(
  #   await zone['dns_records?type=TXT']
  # )
```

output :

```
f983d15896de99536be07269db890488
rm { id: 'f983d15896de99536be07269db890488' }
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