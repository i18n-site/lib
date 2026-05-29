# @3-/apint

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/apint > gen_nt
  @3-/read
  path > join

ROOT = import.meta.dirname

rs = read join ROOT,'test.rs'

nt = gen_nt(rs,'')
console.log nt
```

output :

```
  month : i32

Bill(Uid(uid):Uid) -> Bill
  setup_indent : Option<String>

CardLi(Uid(uid):Uid,setup_indent:Option<::jarg::Json<(String)>>) -> CardLi

Cash(client:Client) -> ()

Setup(Uid(uid):Uid) -> ()

(Uid(uid):Uid) -> BillIndex
[
  {
    Bill: 'month:i32→Bill',
    CardLi: 'setup_indent:String→CardLi',
    Cash: '→()',
    Setup: '→()',
    '': '→BillIndex'
  },
  Set(5) {
    'bill as Bill',
    'card_li as CardLi',
    'cash as Cash',
    'setup as Setup',
    'self as '
  },
  {},
  { Bill: 0, CardLi: 0, Cash: 0, Setup: 0, '': 0 }
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