# @3-/walk

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

import walk, {walkRel} from '@3-/walk'
import {dirname} from 'path'

{pathname} = new URL(import.meta.url)

dir = dirname dirname pathname

console.log dir

console.log '> full path'
for await i from walk(dir,(i)=>i.includes 'node_modules')
  console.log i

console.log '\n> relative path'
for await i from walkRel(
  dir
  (i)=>
    ['src','node_modules'].includes i
)
  console.log '\t',i
```

output :

```
/Users/z/3Ti/node/walk
> full path
/Users/z/3Ti/node/walk/README.mdt
/Users/z/3Ti/node/walk/out.txt
/Users/z/3Ti/node/walk/test/main.coffee
/Users/z/3Ti/node/walk/dev.sh
/Users/z/3Ti/node/walk/dist.sh
/Users/z/3Ti/node/walk/run.sh
/Users/z/3Ti/node/walk/README.md
/Users/z/3Ti/node/walk/build.sh
/Users/z/3Ti/node/walk/package.json
/Users/z/3Ti/node/walk/lib/index.js
/Users/z/3Ti/node/walk/src/index.coffee

> relative path
	 README.mdt
	 out.txt
	 test/main.coffee
	 dev.sh
	 dist.sh
	 run.sh
	 README.md
	 build.sh
	 package.json
	 lib/index.js
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