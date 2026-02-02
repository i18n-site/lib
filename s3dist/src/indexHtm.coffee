#!/usr/bin/env coffee

> pug
  path > join dirname
  esbuild
  coffeescript:CoffeeScript

{dirname:DIR} = import.meta
{CDN} = process.env

< =>
  JS = """
(await(await fetch(CDN+'.v')).text()).split(' ').map((i)=>CDN+i).map (s,p)=>
  p=[
    [
      'link',
      {
        rel: 'stylesheet',
        href:s
      }
    ]
    [
      'script',
      {
        type: 'module',
        crossorigin: 'anonymous'
        src:s
      }
    ]
  ][p]
  d = document
  d.head.appendChild(Object.assign(d.createElement(p[0]), p[1]))
  return
  """

  PUG = """doctype html
  html
    head
      meta(charset="UTF-8")
      meta(name="viewport", content="width=device-width,initial-scale=1")
      script(type="module")
        | !{ js }
    body
  """
  js = 'let CDN='+JSON.stringify(CDN+'/')+';\n'+CoffeeScript.compile(JS,{bare:true})
  {code:js} = await esbuild.transform(js.replaceAll('CDN','C'), {minify:true})
  pug.compile(PUG)({js}).replace('\n','')
