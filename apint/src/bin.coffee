#!/usr/bin/env coffee

> ./index.js > expand_gen
  path > join
  @3-/nt/dump.js

argv = process.argv.slice(2)

dir = argv[1] or process.cwd()

cd dir

dump(
  join dir, 'api.nt'
  (await expand_gen(''))[0]
)

process.exit()
