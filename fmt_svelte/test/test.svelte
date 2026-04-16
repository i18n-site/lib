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
  display flex
  justify-content center
  align-items center
  overflow hidden
  height 100dvh

  &>b
    display flex
    flex-direction column
    align-items stretch

    &>h1
      margin-bottom 1em
      text-align center
      font-size 1.5em

    &>b
      padding 0.5em 1em
      outline 3px solid #eee
      border 1px solid #ccc

      &.model
        text-align center

        &>a
          display inline-block
          margin-bottom 0.4rem
          padding-bottom 0.2rem
          border-bottom 1px solid #00f

    &>p.or
      position relative
      background var(--svgHline) repeat-x 0 50% / 500px
      color #999
      text-align center

      &>b
        padding 0 0.5em
        background #fff

b
  font-weight 400
</style>