#!/usr/bin/env coffee

> @3-/s3dist
  os > homedir
  path > join
  ./S3.js > S3_CDN S3_PUBLIC publicRefresh

css_js = await s3dist(
  join homedir(),'i18n/site'
  S3_PUBLIC
  publicRefresh
  S3_CDN
)
console.log css_js
process.exit()
