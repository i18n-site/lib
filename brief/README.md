# @3-/brief

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/brief:Brief
  @3-/read
  path > join

ROOT = import.meta.dirname

MAX_TOKENS = 8192

CONF = [
  'https://api.siliconflow.cn/v1/'
  [
    process.env.SF_KEY
  ]
]

MODEL = 'Qwen/Qwen3-8B'

BRIEF = Brief(CONF, MODEL, MAX_TOKENS)
txt = read(join(ROOT, 'test.txt'))
[tag_li] = await BRIEF txt.slice(0,450)
console.log tag_li

[tag_li, brief] = await BRIEF txt
console.log tag_li
console.log brief
console.log brief.length
```

output :

```
[ '电池寿命', '新能源汽车', '续航衰减' ]
[ '新能源车', '电池寿命', '续航焦虑', '固态电池', '二手车市场', '燃油车', '技术升级' ]
本文讨论了新能源汽车电池寿命的问题，指出其实际衰减较低，20年后仍保留64%容量，远超燃油车使用年限。虽然中汽研与Geotab的报告存在差异，但前者样本量较小，后者更具说服力。同时，文章谈到新能源车仍面临续航焦虑、成本高等挑战，短期内无法彻底取代燃油车。固态电池虽有潜力，但成本高昂，难以普及。新能源车在二手车市场逐步发展，但仍需解决诸多问题才能进一步提升渗透率。
182
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
