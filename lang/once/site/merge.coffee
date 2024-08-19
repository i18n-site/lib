#!/usr/bin/env coffee

> @3-/read
  @3-/write
  path > join

ROOT = import.meta.dirname

txtLi = (fp)=>
  read(join ROOT, fp).split('\n').filter(Boolean)

google = (fp)=>
  r = new Map
  for i from txtLi fp+'.txt'
    p = i.lastIndexOf(' ')
    cn = i.slice(0, p)
    code = i.slice(p + 1)
    r.set(code, cn)
  return r


google_cn = google 'google.cn'
google_en = google 'google.en'

ali = new Set
ALI_GOOGLE = {
  hbs:'hr'
}

for i from txtLi 'ali.txt'
  p = i.lastIndexOf(' ')
  code = i.slice(p+1).trim()
  ali.add ALI_GOOGLE[code] or code

volcengine = new Set
for i from txtLi 'volcengine.txt'
  p = i.indexOf(' ')
  code = i.slice(0,p)
  volcengine.add code

translation = JSON.parse read join ROOT,'translation.json'
languages = JSON.parse read join ROOT,'languages.json'
wikipedia = new Map(
  JSON.parse(read join ROOT,'wikipedia-languages.json').map(
    ({languageCode,languageName})=>[languageCode,languageName]
  )
)
wwc = new Map(
  [...Object.entries(JSON.parse(read join ROOT,'ISO_639-WWC-Modified.json'))].map(
    ([code,{native:name}])=>[code,name[0]]
  )
)
nativeName = new Map
for i from txtLi 'native.txt'
  p = i.indexOf(' ')
  code = i.slice(0,p)
  name = i.slice(p+1)
  nativeName.set code, name

order = txtLi('order.txt').map((i)=>i.split(' ')[0])

native_name = new Map
lang_li = []
rtl_li = []

for i from google_en.keys()
  if not google_cn.has i
    console.log 'google cn miss',i
  if not ( volcengine.has(i) or ali.has(i) )
    console.log 'miss',i, google_cn.get(i)
    continue
  tr = translation[i]
  if tr
    if tr.dir != 'ltr'
      rtl_li.push i
  name = tr?.nativeName or wwc.get(i) or wikipedia.get(i) or languages[i]?.nativeName or nativeName.get(i)
  if name
    native_name.set(i, name)
    lang_li.push i
  else
    console.log 'miss name', i, google_cn.get(i)

lang_li.sort (a,b)=>
  a = order.indexOf(a)
  b = order.indexOf(b)
  if a < 0 and b < 0
    if a > b
      return -1
    else
      return 1
  if b < 0
    b = 1e5
  if a < 0
    a = 1e5
  a - b

# for i from order
#   if not native_name.has i
#     console.log 'order code miss ', i

native_li = []
en_li = []
zh_li = []

case_li = []

for i in lang_li
  name = native_name.get(i).replace(' (','(')
  native_li.push name
  if name.toLocaleLowerCase() == name.toLocaleUpperCase()
    case_li.push 0
  else
    case_li.push 1
  zh_li.push google_cn.get(i).replace(' (','(').replace('（','(').replace('）',')')
  en_li.push google_en.get(i).replace(' (','(')

SRC = join ROOT,'../../src'

write(
  join SRC, 'CODE.js'
  'export default \''+lang_li.join(';')+'\'.split(\';\')'
)
write(
  join SRC, 'CASE.js'
  'export default '+JSON.stringify(case_li)
)

for [fp, li] in [
  ['native',native_li]
  ['zh',zh_li]
  ['en',en_li]
]
  write(
    join SRC, 'name', fp+'.js'
    '''export default \''''+li.join(';')+'\'.split(\';\')'
  )

write(
  join SRC,'RTL.js'
  "export default new Set('#{rtl_li.join(';')}'.split(';'))"
)


