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
