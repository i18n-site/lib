# @3-/htm2md

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/htm2md

for htm from [
  '<h1>I18N.SITE · 文档无国界 <img src="//ok0.pw/5l" style="width:42px;float:right;margin-top:6px"></h1>'
  '<p>test&gt;</p>'
  '<p>test&gt;<a href="#">b</a></p>'
  '<p>修改译文后需要重新运行 <code>./i18n.sh</code> 更新缓存。</p>'
  '<p>修改译文后需要重新运行 <a href="/">./i18n.sh</a> 更新缓存。</p>'
  '<img src="/x.png" alt="123" />'
  '<img src="/x.png" alt="123" style="width:100px">'
  '<p>需要在 ``` 之后表明语言， 比如 <code>```rust</code> 。</p>'
  '<p>我想说，<strong>只有做了全站国际化，才能支持多语种的站内全文搜索和搜索引擎优化</strong>。</p>'
]
  console.log htm2md htm
```

output :

```
# I18N.SITE · 文档无国界 <img src="//ok0.pw/5l" style="width:42px;float:right;margin-top:6px">
test&gt;
test&gt;[b](#)
修改译文后需要重新运行 `./i18n.sh` 更新缓存。
修改译文后需要重新运行 [./i18n.sh](/) 更新缓存。
![123](/x.png)
<img src="/x.png" alt="123" style="width:100px">
需要在 \``` 之后表明语言， 比如 ` ```rust` 。
我想说，**只有做了全站国际化，才能支持多语种的站内全文搜索和搜索引擎优化**。
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