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
      input(type="file" name="file" accept=".txt,.md")
  p.or
    b 或者
  b
    p 发送飞书文档的连接
    p
      input(type="url" name="url" placeholder="飞书文档的链接")
  hr
  b.model
    | 管理能力素质模型
    a(href="#")

</template>

<style lang="stylus">
:global(_)
  overflow hidden
  height 100dvh
  display flex
  align-items center
  justify-content center


  &>b
    flex-direction column
    align-items stretch
    display flex
    &>h1
      font-size 1.5em
      text-align center
      margin-bottom 1em
    &>b
      border 1px solid #ccc
      padding .5em 1em
      outline 3px solid #eee
      &.model
        text-align center
        &>a
          border-bottom 1px solid #00f
          padding-bottom .2rem
          margin-bottom .4rem
          display inline-block
    &>p.or
      color #999
      text-align center
      position relative
      background: var(--svgHline) repeat-x 0 50% / 500px
      &>b
        background #fff
        padding 0 .5em

b
  font-weight 400

</style>
