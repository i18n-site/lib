#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/uridir
  path > join

ROOT = uridir(import.meta)

js_fp = join ROOT,'pkg/_.js'
js = read(js_fp)

js = js.replace('export function vbyteE','export function _vbyteE')

class_li = []
for line from js.split '\n'
  if line.startsWith 'export class'
    class_li.push(line.slice(13,-1).trim())

js += "const newCls = (cls)=>(...args)=>new cls(...args);"
for i from class_li
  f = i.charAt(0).toLowerCase() + i.slice(1)
  js += """
export const #{f} = newCls(#{i});
"""

write(
  js_fp
  js
)
