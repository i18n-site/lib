#!/usr/bin/env coffee

> @3-/seoping
  @3-/read
  path > join
  ../lib/indexNow.js
  # ../lib/google.js
  # ../lib/baidu.js


console.log await indexNow(
  ''
  'i18n.site'
  [
    'https://i18n.site'
    'https://i18n.site/i18n.site'
  ]
)


# console.log await baidu(
#   'i18n.site'
#   ''
#   [
#     'https://i18n.site/i18n.site'
#   ]
# )
# ROOT = import.meta.dirname

# json = JSON.parse read join(
#   ROOT
#   'google-index-api.json'
# )
#
# ping = await google(
#   json.client_email,json.private_key
# )
#
# r = await ping [
#   'https://i18n.site/i18n.site'
# ]
#
# console.log r
#
# await seoping [
#   # 'https://i18n.site'
#   [
#     'https://i18n.site/i18n.site'
#     'i18n.site'
#   ]
# ]
