# @3-/ipreq

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/ipreq/fTxt.js

console.log '>>>',await fTxt(
  'i18n.site'
  '.i'
  '111.63.51.41'
  2000
)
```

output :

```
>>> [
  '<!doctypehtml><meta content="width=device-width,initial-scale=1"name=viewport><meta charset=UTF-8><script>(async(D,S)=>{window._S=await S.register("/S.js");await S.ready;S.controller?(D.head.append(S=D.createElement("script")),S.src="/_"):location.reload()})(document,navigator.serviceWorker);</script>\n',
  {
    'accept-ranges': 'bytes',
    'alt-svc': 'h3=":443"; ma=300, quic="111.63.51.42:443"; ma=300; v="44,43,39"',
    'cache-control': 'max-age=900000',
    connection: 'close',
    'content-encoding': 'br',
    'content-type': 'text/html; charset=utf-8',
    date: 'Thu, 04 Jul 2024 07:48:56 GMT',
    etag: '"defd1b0b88388741792056ea5cf324c4"',
    server: 'JSP3/2.0.14',
    'strict-transport-security': 'max-age=63072000; includeSubDomains',
    'transfer-encoding': 'chunked',
    'x-cache-status': 'MISS'
  },
  200
]
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