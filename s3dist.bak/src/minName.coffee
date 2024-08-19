#!/usr/bin/env coffee

> @3-/jsmap > JsMap
  fs/promises > opendir readFile
  path > dirname join
  @3-/blake > blake3Hash
  ./hashName.js
  ./upload.js
  ./renameMain.js
  ./publicUpload.js
  @3-/dbq > $q

INDEX_HTM = 'index.htm'

export default (ROOT, cdn_host, s3_cdn, s3_public, public_refresh)=>

  # IGNORE = new Set
  #
  # PUBLIC = join(ROOT,'public')
  #
  # public_upload = []
  #
  # for await fp from await opendir PUBLIC
  #   {name} = fp
  #   if name != INDEX_HTM
  #     IGNORE.add name
  #     public_upload.push fp
  #
  # public_uploading = publicUpload(
  #   cdn_host
  #   s3_public
  #   PUBLIC
  #   public_upload
  #   public_refresh
  # )

  # DIST = join ROOT, 'dist'
  #
  # hash_name = new JsMap
  #
  # hash_name_add = (dir, name)=>
  #   bin = await readFile join dir,name
  #   hash = Buffer.from blake3Hash bin
  #   hash_name.set hash, name
  #   return
  #
  # file_li = []
  # for await fp from await opendir DIST
  #   {name} = fp
  #   if not IGNORE.has name
  #     if fp.isFile()
  #         file_li.push name
  #     else
  #       console.warn "!!! not supported dir", fp.name
  #
  # # 让这个文件名跟随内容变化,否则会有缓存文件
  # # await renameMain(DIST,file_li)
  #
  # for name from file_li
  #   if name!=INDEX_HTM
  #     await hash_name_add DIST, name

  # I18N = 'i18n'
  # for await fp from await opendir join(DIST, I18N)
  #   await hash_name_add DIST, I18N + '/' + fp.name

  [id_name, to_upload] = await hashName('dist', hash_name)
  r = await upload(
    s3_cdn
    DIST
    id_name
    to_upload
  )

  if to_upload.length
    await $q(
      "UPDATE dist SET uploaded=true WHERE id IN (?)"
      to_upload
    )

  await public_uploading
  return r

