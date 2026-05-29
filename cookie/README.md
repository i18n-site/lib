# @3-/cookie

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/cookie/cookieE.js
  @3-/cookie/cookieD.js

SK = Buffer.from 'IQfqZVBU5v6jOwq40ZsqcWRAVYSRYCs4', 'base64url'

console.log cookieE SK,'a',[13223]

cookie = 'WzEzMjIzXfEalIkQh7QJxRAYm8p1h4MB_9onVwQ_qxtzlZ0wkD0y'

console.log cookieD SK, cookie
```

output :

```
a=WzEzMjIzXfEalIkQh7QJxRAYm8p1h4MB_9onVwQ_qxtzlZ0wkD0y;expires=Sat, 23 Oct 2027 09:13:59 GMT;path=/;Secure;Partitioned;HttpOnly;SameSite=None
[ 13223 ]
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
