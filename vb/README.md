# @w5/vbyte

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/vb/vbE
  @3-/vb/vbD
  @3-/vb/vsE
  @3-/vb/vsD

#   @w5/uridir
#   path > join

# ROOT = uridir(import.meta)

for li from [
  [11,3,9,2,9,10]
  [2,0]
  [3,5]
  [9]
  []
]
  console.log li
  console.log vsD(vsE(li))
# li = [
#   Number.MAX_SAFE_INTEGER
#   127
#   128
#   256
#   1234567890
# ]
#
# console.log li
#
# b = vbE li
# console.log b
# console.log vbD b
#   # console.log n, n == vbyteD b
```

output :

```
[ 11, 3, 9, 2, 9, 10 ]
[ 2, 3, 9, 9, 10, 11 ]
[ 2, 0 ]
[ 0, 2 ]
[ 3, 5 ]
[ 3, 5 ]
[ 9 ]
[ 9 ]
[]
[]
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