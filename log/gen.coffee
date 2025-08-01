#!/usr/bin/env coffee
> @3-/write
  path > join

COLOR =
 black: 30
 red: 31
 green: 32
 yellow: 33
 blue: 34
 magenta: 35
 cyan: 36
 white: 37
 gray: 90
 orange: '38;2;255;68;0'

for [color, code] in Object.entries COLOR
  if Number.isInteger code
    code = ';'+code
  console.log color
  js = """
import {colored, default as colorer}from './index.js'
export const #{color} = colored('#{code}');
export default process.env.NODE_ENV==='production'?console.log:colorer(#{color},console.log)
  """
  write(
    join import.meta.dirname, 'src', color.toUpperCase()+'.js'
    js
  )
