#!/usr/bin/env coffee

> @3-/protojs
  @3-/uridir
  ansis > greenBright
  path > join
  fs > readdirSync

ROOT = uridir(import.meta)

console.log await protojs join ROOT, 'api.proto'
