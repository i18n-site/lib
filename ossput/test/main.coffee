#!/usr/bin/env coffee

> @3-/ossput
  ./S3.js > PUBLIC
  fs > createReadStream
#   @3-/uridir
#   path > join

# ROOT = uridir(import.meta)


put = ossput PUBLIC

file = import.meta.url.slice(7)

await put(
  "test.coffee"
  =>
    createReadStream(file)
  "text/js"
  file
)
