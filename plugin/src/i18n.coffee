#!/usr/bin/env coffee

> json5
  @3-/swc
  fs > readdirSync rmSync existsSync
  path > join
  ./nodeModules.js
  ansis > green yellow gray
  @3-/yml/Yml.js
  @3-/write
  @3-/utf8/utf8e.js
  @3-/urle
  @3-/u8/u8eq.js
  @3-/lang:LANG
#   @3-/utf8/utf8d.js
#
# decode = (bin)=>
#   li = []
#   start = 0
#   for i,p in bin
#     if i == 0
#       li.push utf8d bin.subarray start, p
#       start = p + 1
#   return li


merge = (li)=>
  totalLength = li.reduce(
    (acc, arr) => acc + arr.length
    0
  ) + li.length - 1

  mergedArray = new Uint8Array(totalLength)

  currentIndex = 0

  for arr, index in li
    mergedArray.set(arr, currentIndex)

    currentIndex += arr.length

    if index isnt li.length - 1
      mergedArray[currentIndex++] = 0

  return mergedArray


bind = (lang, tran, keys, yml)=>
  map = tran.get(lang)
  if not map
    map = new Map
    tran.set(lang, map)
  for [k,v] from Object.entries yml
    if not keys.has k
      keys.add k
      if map.has k
        console.log '⚠️ KEY CONFLICT '+k
    map.set k, v
  return

gen = (pkg, tran, dir)=>
  keys = new Set

  for [lang] from LANG
    yml = Yml join dir,lang
    bind lang, tran, keys, yml.i18n

  keys = [...keys]
  keys.sort()
  console.log yellow(pkg), gray(':'), keys.join(' ')

  return

export default main = (ROOT)=>
  console.log green '\n# i18n'
  SRC = join ROOT,'src'
  GEN_I18N = join ROOT, '.gen/i18n'
  rmSync(GEN_I18N, { recursive: true, force: true })

  i18n = 'i18n'
  i18n_dir = join(ROOT,i18n)
  tran = new Map

  if existsSync i18n_dir
    gen '.',tran, i18n_dir

  for i from nodeModules(ROOT,[i18n])
    gen i, tran, join(ROOT, 'node_modules', i)

  en = tran.get('en')
  if en
    keys = [...en.keys()]
    keys.sort()

    for [lang, map] from tran.entries()
      li = []
      for k from keys
        v = map.get(k)
        if v == undefined
          console.log '⚠️ i18n miss '+lang+' '+k
          v = ''
        li.push utf8e v
      bin = merge li
      write(
        join GEN_I18N, lang+'.js'
        bin
      )
    write(
      join(
        GEN_I18N, 'index.js'
      )
      (
        await swc(
          'export const '+ keys.map(
            (i,p)=>"_$#{i}=#{p}"
          ).join(',')+';'
        )
      ).code
    )
  return


if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  await main('/Volumes/d/i18n/site')
