#!/usr/bin/env coffee

> @3-/cname_flatten:flatten

process.on(
  'uncaughtException'
  (err) =>
    console.error('uncaughtException',err)
    return
)

arg_li = [
  # [
  #   '3ti.site'
  #   '3ti.site.s2-web.dogedns.com'
  #   'u-01.eu.org'
  # ]
  ['i18n.site', 'i18n.site.a.bdydns.com','x01.site']
]
for arg from arg_li
  for type from ['A','AAAA']
    for i from await flatten(
      type
      ...arg
    )
      console.log '>',type,arg[0]
