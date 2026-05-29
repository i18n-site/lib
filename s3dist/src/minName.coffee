#!/usr/bin/env coffee

> fs/promises > opendir readFile
  # @3-/jsmap > JsMap
  @3-/blake > blake3Hash hashFp hashFpLen
  @3-/pg/PG.js > LI $LI EXE
  path > join
  ./mreplace.js
  ./urleId.js
  ./CONST.js > INDEX_HTM
  ./renameMain.js
  # ./hashName.js
  # ./publicUpload.js
  # @3-/dbq > $q

distFileLi = (dist, ignore)=>
  hash_name_add = (dir, name)=>
    bin = await readFile join dir,name
    hash = Buffer.from blake3Hash bin
    hash_name.set hash, name
    return

  file_li = []
  for await fp from await opendir dist
    {name} = fp
    if not ignore.has name
      if fp.isFile()
          file_li.push name
      else
        console.warn "!!! not supported dir", fp.name
  file_li



hashMap = (site_id, dist, file_li)=>
  rel_li = []
  id_li = []
  ts_li =[]
  len_li = []
  hash_li = []

  idTs = =>
    (
      await LI"SELECT id,ts FROM upload_id_ts(#{site_id},#{len_li},#{$LI hash_li})"
    ).forEach ([id, ts])=>
      id_li.push id
      ts_li.push ts
      return
    return

  set = (fp)=>
    [hash,len] = await hashFpLen(fp)
    hash_li.push hash
    len_li.push len
    rel_li.push fp.slice(dist.length+1)

    if hash_li.length > 256
      await idTs()
      len_li = []
      hash_li = []
    return

  for name from file_li
    if name!=INDEX_HTM
      await set join(dist,name)

  i18n = join(dist, 'i18n')
  for await {name} from await opendir i18n
    fp = i18n + '/' + name
    await set fp

  if hash_li.length
    await idTs()

  [id_li, rel_li, ts_li]

export default (
  site_id
  dist
  ignore
)=>

  file_li = await distFileLi dist, ignore

  # 修改文件名为内容散列,否则会有缓存文件
  await renameMain(dist,file_li)

  [id_li] = li = await hashMap site_id, dist, file_li

  e_id_li = id_li.map urleId

  await mreplace(dist, e_id_li, ...li.slice(1))

  return [
    e_id_li
    ...li
  ]
