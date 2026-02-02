#!/usr/bin/env coffee

> @3-/npmv_refresh
  path > join

  @3-/npmv_refresh/CONF.js:@ > init:initConf
  @3-/npmv_refresh/Purge.js

ROOT = import.meta.dirname
conf = join(
  ROOT
  '../../../ol/conf/npmv_refresh/conf.mjs'
)

# await initConf(conf)
#
# purge = Purge(
#   CONF.HOST, CONF.TOKEN
# )
#
# await purge(
#   'i18md'
#   CONF.VPS_LI.a1
# )
await NpmvRefresh(conf)
