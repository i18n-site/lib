# @3-/nt

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/nt/loads.js
  @3-/nt/dumps.js

# li = loads '''
# # t1
# a:
#   # t2
#   b:
#     c: 1
#     # t3
#     d: 2
#   x: 3
#   y:
#     - m
#     - n
# e:
#   f:
#     > 123
#     > 456
# '''
# console.log dumps li

li = loads '''
cnameFlatten:
  - i18n.site
    - i18n.site.a.bdydns.com/user0.cf
  - 3ti.site
    - 3ti.site.s2-web.dogedns.com/u-01.eu.org
'''
console.log JSON.stringify(li,null,2)
# en:
#  zh :
#   - a: b
#   -
#     c: d
#     e: f

# li = loads '''
# - a
# - b
# '''
# console.log dumps li
#
# li = loads '''
# a:
#   > 123
#   > 235
# b:
#   > 123
#   > 235
# '''
# console.log dumps li
```

output :

```
{
  "cnameFlatten": [
    [
      "i18n.site",
      [
        "i18n.site.a.bdydns.com/user0.cf"
      ]
    ],
    [
      "3ti.site",
      [
        "3ti.site.s2-web.dogedns.com/u-01.eu.org"
      ]
    ]
  ]
}
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