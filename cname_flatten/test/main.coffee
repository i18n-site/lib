#!/usr/bin/env coffee

> @3-/cname_flatten:flatten

process.on(
  'uncaughtException'
  (err) =>
    console.error('uncaughtException',err)
    return
)

arg_li = [
  ['i18n.site', 'js0.site.a1.initgg.com','x01.site']
]
for arg from arg_li
  for type from ['A','AAAA']
    for i from await flatten(
      type
      ...arg
    )
      console.log '>',type,arg[0]
