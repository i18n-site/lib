# @3-/hwdns

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/hwdns/purge


# await purge 'i18n.site'


# MX 数值越小优先级越高





###
if recordsets.length > 0
  console.log await rm(zoneId, recordsets.map (i)=>i.id)
###

# console.log await enable()

# console.log zoneId

#
# for i from acme.recordsets
#   console.log i.name, i.status, i.type
#   if i.status == 'ACTIVE'
#     await disable i.id
#
# for i from acme.recordsets
#   console.log i.name, i.status, i.type
#   await enable i.id


console.log ''

# const client = dns.DnsClient.newBuilder()
#                             .withCredential(credentials)
#                             .withEndpoint(endpoint)
#                             .build();
# const request = new dns.SetRecordSetsStatusRequest();
# request.recordsetId = "123";
# const body = new dns.SetRecordSetsStatusReq();
# body.withStatus("DISABLE");
# request.withBody(body);
# const result = client.setRecordSetsStatus(request);
# result.then(result => {
#     console.log("JSON.stringify(result)::" + JSON.stringify(result));
# }).catch(ex => {
#     console.log("exception:" + JSON.stringify(ex));
# });
```

output :

```
./out.txt
```

## About This Project

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于本项目

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。