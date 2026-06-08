> ./INIT_PUB.js
  ./indexHtm.js
  ./mime.js
  @3-/blake > hashFp blake3Hash
  @3-/ossput
  @3-/retry
  @3-/pg/PG.js > LI0 UNSAFE $LI Q
  @3-/utf8/utf8e.js
  ./POOL.js
  fs > createReadStream
  fs/promises > opendir readFile
  path > join
  ./CONST.js > INDEX_HTM


needUpload = (site_id, rel_li, hash_li)=>
  max = 3
  while --max
    try
      return await LI0"SELECT rel FROM pub_rel_hash(#{site_id},#{$LI rel_li},#{$LI hash_li})"
    catch e
      if e.code == '42883'
        console.log 'INIT PUB'
        console.log INIT_PUB
        await UNSAFE(INIT_PUB)
      else
        throw e
  return

< (root, site_id, s3_public, public_refresh)=>
  public_refresh = retry public_refresh
  ignore = new Set

  pubdir = join(root,'public')

  index_htm = utf8e(await indexHtm())

  upload = (rel_li,hash_li)=>
    li = await needUpload site_id, rel_li, hash_li
    if li.length

      rli = []
      hli = []

      set = new Set li
      for i,p in rel_li
        if set.has i
          rli.push i
          hli.push hash_li[p]

      put = ossput s3_public

      li.forEach (i)=>
        await POOL(
          put, i
          if i == INDEX_HTM then =>
            index_htm
          else =>
            createReadStream join pubdir, i
          mime(i)
        )
        return

      await POOL.done
      await public_refresh li
      await LI0"SELECT pub_rel_hash_set(#{site_id},#{Q.array rli},#{Q.array hli})"
    return

  rel_li = [INDEX_HTM]
  hash_li = [blake3Hash index_htm]

  for await fp from await opendir pubdir
    {name} = fp
    if name != INDEX_HTM
      ignore.add name
      if fp.isFile()
        fp = join fp.parentPath, name
        hash_li.push await hashFp fp
        rel_li.push fp.slice(pubdir.length+1)
        if rel_li.length > 64
          await upload rel_li, hash_li
          rel_li = []
          hash_li = []

  if rel_li.length
    await upload rel_li, hash_li

  ignore
