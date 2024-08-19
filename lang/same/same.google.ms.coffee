#!/usr/bin/env coffee

> @3-/read
  @3-/uridir
  @3-/write
  path > join dirname
  json5

ROOT = dirname uridir import.meta

cn2code = new Map
code2cn = new Map

for [code,cn] from (
  await import(
    join(ROOT,'src/zh.coffee')
  )
).default
  cn2code.set cn,code
  code2cn.set code, cn

lang = JSON.parse read join(
  ROOT, 'lang.json'
)


google_ms = {}
google_same_ms = new Set
code_en_li = []
code_native_li = []
rtl = new Set
miss_in_google = new Map
for [code,{nativeName, name, dir}] from Object.entries lang.translation
  # console.log code, nativeName, dir
  if nativeName.includes '中文 (简体)'
    nativeName = '简体中文'
  else if nativeName.includes '繁體中文'
    nativeName = '正體中文'
  switch code
    when 'zh-Hans'
      google_code = 'zh'
    when 'zh-Hant'
      google_code = 'zh-TW'
    when 'mn-Cyrl'
      google_code = 'mn'
    # when 'mni'
    #   google_code = 'mni-Mtei'
    when 'nb'
      google_code = 'no'
    when 'fil'
      google_code = 'tl'
    when 'ku'
      google_code = 'ckb'
    when 'kmr'
      google_code = 'ku'
    when 'sr-Cyrl'
      google_code = 'sr'
    when 'mww'
      google_code = 'hmn'
    when 'he'
      google_code = 'iw'
    else
      google_code = code

  if code2cn.has google_code
    console.log code, nativeName, name
    if code == google_code
      google_same_ms.add code
    else
      google_ms[google_code] = code
    code_en_li.push [google_code, name]
    code_native_li.push [google_code, nativeName]
    if dir == 'rtl'
      rtl.add google_code
    code2cn.delete google_code
  else
    miss_in_google.set code,name

write(
  join ROOT,'src/googleMS.coffee'
  [
    '< GOOGLE_MS_SAME = new Set(\''+[...google_same_ms].join(' ')+'\'.split(\' \'))'
    '< GOOGLE_MS = '+json5.stringify(google_ms)
    '''
< (code)=>
  if GOOGLE_MS_SAME.has code
    return code
  return GOOGLE_MS[code]
    '''
  ].join '\n'
)
write(
  join ROOT,'src/rtl.js'
  'export default new Set(\''+[...rtl].join(' ')+'\'.split(\' \'))'
)
dump = (name, li)=>
  write(
    join ROOT,'src',name+'.js'
    'export default '+JSON.stringify li,null,2
  )

estimated_ranking = [
  'en', 'zh', 'es', 'ar', 'pt', 'fr', 'ru', 'ja', 'de', 'id',
  'ko', 'vi', 'it', 'tr', 'fa', 'th', 'pl', 'nl', 'uk', 'ro',
  'el', 'cs', 'sv', 'hu', 'fi', 'da', 'no', 'he', 'bg', 'sk',
  'sr', 'lt', 'lv', 'et', 'hr', 'sl', 'mk', 'ms', 'hi', 'bn',
  'ur', 'sw', 'ml', 'te', 'ta', 'mr', 'pa', 'gu', 'kn', 'or',
  'my', 'ne', 'si', 'km', 'lo', 'hy', 'az', 'uz', 'kk', 'ky',
  'ka', 'tg', 'tk', 'ps', 'sd', 'am', 'ha', 'ig', 'yo', 'sn',
  'so', 'mg', 'st', 'rw', 'ln', 'xh', 'zu', 'af', 'cy', 'mt',
  'ga', 'gl', 'eu', 'is', 'bs', 'sq', 'lv', 'ht', 'sm', 'mi',
  'hmn', 'ti', 'dv', 'gom', 'mai', 'ckb', 'ku', 'tt', 'ug'
]
dump 'en',code_en_li

code_native_li.sort (a,b)=>
  p = estimated_ranking.indexOf(a[0])
  if p < 0
    p = 999
  p2 = estimated_ranking.indexOf(b[0])
  if p2 < 0
    p2 = 999
  if p == p2
    if a[0] > b[0]
      return 1
    else
      return -1
  p - p2

dump 'index',code_native_li

# console.log rtl
# console.log code2cn
# console.log miss_in_google
# console.log Object.keys(google2ms).length
