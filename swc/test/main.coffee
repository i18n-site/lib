#!/usr/bin/env coffee

> @3-/swc
  @3-/read
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)

console.log await swc read('/Users/z/i18n/18x/serviceWorker/serviceWorker._.js'), 'xx'
