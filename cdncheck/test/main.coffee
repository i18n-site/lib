#!/usr/bin/env coffee

> @3-/cdncheck

console.log await cdncheck(
  'i18n.site'
  '.js'
  [
    '110.53.110.41'
    '188.114.96.3'
  ]
)
