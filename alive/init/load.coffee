#!/usr/bin/env coffee
> @3-/uridir
  @3-/nt/load.js
  @3-/alive/loadKind.js
  @3-/alive/loadIp.js
  path > join

ROOT = uridir import.meta

{
  kind
  watch
  ip
} = new Proxy(
  {}
  get: (_, fp) =>
    load join ROOT,fp+'.nt'
)


[
  IP
] = await Promise.all [
  loadIp ip
  loadKind kind
]

await (await import('@3-/alive/loadWatch.js')).default(
  watch
)

process.exit()
