> @3-/binmap > BinMap
  @3-/write
  @3-/utf8/utf8e.js
  fs > existsSync unlinkSync readFileSync

encode = (k)=>
  if k.constructor == String
    k = utf8e k
  k

< (fp)=>
  # 每次都重建，这样可以淘汰不存在的key
  m = new BinMap
  if existsSync fp
    prem = BinMap.load readFileSync fp
  else
    prem = m

  change = 0

  [
    (k)=> # get
      k = encode k
      if prem.has(k)
        v = prem.get k
        m.set k,v
        return v
      return


    (k,v)=> # set
      ++change
      k = encode k
      v = encode v
      m.set k,v
      prem.set k,v
      return

    => #save
      if m.size
        if change
          write(
            fp
            m.dump()
          )
      else if existsSync fp
        unlinkSync fp
      return
  ]

