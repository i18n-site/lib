#!/usr/bin/env coffee


< default main = (txt)=>
  n = txt.replace(/[\\\/\s-_\.\$%\+\*\#]/g,'')
  if n
    return /^\d+$/.test(n)
  return 1


if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  console.log main '11 - 2 3_4 \/'
  console.log main 'a b c'
  console.log main '1a b c'


