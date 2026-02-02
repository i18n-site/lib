#!/usr/bin/env coffee

> ../src/lib.js:rolldown
  path > join
  fs > copyFileSync

ROOT = import.meta.dirname

bundle_fp = join ROOT,'bundle.js'

src_fp = copyFileSync(
  join ROOT,'test.js'
  bundle_fp
)

console.log await rolldown(
  bundle_fp
  {
    external: ['@3-/write']
  }
  false
)

# console.log await rolldown 123
