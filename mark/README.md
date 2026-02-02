# @3-/mark

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/mark
  @3-/read
  path > join

ROOT = import.meta.dirname
md = read join ROOT, 'test.md'

console.log mark md
```

output :

```
<blockquote class="NOTE M"><p>突出重点信息，即使用户在粗略阅读时也应注意。</p></blockquote><blockquote class="TIP M"><p>提供可选信息，助力用户取得更好的成效。</p></blockquote><blockquote class="IMPORTANT M"><p>提供对用户成功至关重要的关键信息。</p></blockquote><blockquote class="WARNING M"><p>紧急提示关键内容，因存在潜在风险，需用户立即关注。</p></blockquote><blockquote class="CAUTION M"><p>指出某一行为可能带来的负面潜在后果。</p></blockquote><blockquote><p>[! x] xxx</p></blockquote>
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