#!/usr/bin/env coffee

> @3-/plugin/nodeModules.js
  path > join
  os > homedir

for i from nodeModules join(homedir(),'/i18n/site'),'i18n'
  console.log i
