# @3-/fmt_svelte

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> fmt_svelte/styl.js
  fmt_svelte/pug.js
  fmt_svelte/svelte.js
  @3-/read
  path > join

# console.log styl """
# @import 'nib'
#
# body
#   padding: 20px 10px
#   font: 14px/1.5 "Helvetica Neue", Arial, sans-serif
#   color: #333
#
# a
#   color: #00b7ff
#   text-decoration: none
#
# .container
#   width: 80%
#   margin: 0 auto
# """
#
# console.log await pug """
# doctype html
# html(  lang="en")
#   head
#     title My Pug Page
#   body
#     div(class="container" id="main" data-info="some-data")
#       p(class="text-bold" style="color: blue;") Hello, World!
#       input(type="text" disabled name="username" @&xxx :title)
# """

console.log await svelte read(
  join(
    import.meta.dirname
    'test.svelte'
  )
)
```

output :

```
<script lang="coffee">
> svelte > onMount

onMount =>
  console.log '> hello'
  return
</script>

<template lang="pug">
b
  h1 面试信息抽取
  b
    p 上传面试录音转写的 txt / md 文件
    p
      input(accept=".txt,.md" name="file" type="file")
  p.or
    b 或者
  b
    p 发送飞书文档的连接
    p
      input(name="url" placeholder="飞书文档的链接" type="url")
  hr
  b.model
    | 管理能力素质模型
    a(href="#")
</template>

<style lang="stylus">
:global(_)
  align-items center
  display flex
  height 100dvh
  justify-content center
  overflow hidden

  &>b
    align-items stretch
    display flex
    flex-direction column

    &>h1
      font-size 1.5em
      margin-bottom 1em
      text-align center

    &>b
      border 1px solid #ccc
      outline 3px solid #eee
      padding 0.5em 1em

      &.model
        text-align center

        &>a
          border-bottom 1px solid #00f
          display inline-block
          margin-bottom 0.4rem
          padding-bottom 0.2rem

    &>p.or
      background var(--svgHline) repeat-x 0 50% / 500px
      color #999
      position relative
      text-align center

      &>b
        background #fff
        padding 0 0.5em

b
  font-weight 400
</style>
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
