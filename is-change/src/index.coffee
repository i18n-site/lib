#!/usr/bin/env coffee

> @3-/binmap > BinMap
  @3-/u8/u8eq.js
  @3-/write
  @3-/xxhash3 > hash128
  @3-/cache
  @3-/vbyte > vbyteE
  fs > statSync readFileSync existsSync
  path > join

< (cache_dir, dir)=>
  cache_path = join(
    cache_dir
    '.cache'
  )
  hash_path = join(
    cache_dir
    '.hash'
  )
  m = new BinMap
  hash_map = new BinMap
  if existsSync(cache_path) and existsSync(hash_path)
    pre = BinMap.load readFileSync cache_path
    pre_hash_map = BinMap.load readFileSync hash_path

    isChange = cache (rfp)=> # isChange
      fp = join dir, rfp
      if existsSync fp
        stats = statSync fp
        size_mtime = vbyteE [stats.size,stats.mtime]
        key = hash128(rfp)
        m.set key, size_mtime

        # 确保设置了，不然会被清掉
        pre_hash = pre_hash_map.get(key)
        if pre_hash
          hash_map.set key, pre_hash

        pre_sm = pre.get(key)
        if pre_sm and u8eq size_mtime, pre_sm
          return false

        now_hash = hash128 readFileSync fp
        if pre_hash and u8eq pre_hash, now_hash
          return false
        hash_map.set key, now_hash
      true
  else
    isChange = => true
  [
    isChange
    (li)=> # save
      for fp from li
        if existsSync fp
          stats = statSync join dir,fp
          key = hash128 fp
          m.set key, vbyteE [
            stats.size,stats.mtime
          ]
          hash_map.set key, hash128 readFileSync fp

      for [cfp, map] from [
        [cache_path, m]
        [hash_path, hash_map]
      ]
        write(
          cfp
          map.dump()
        )
      return
  ]
