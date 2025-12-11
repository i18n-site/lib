< (q)=>
  (table)=>
    cache = new Map await q 'SELECT val,id FROM '+table
    insert = 'INSERT INTO '+table+'(val) VALUES (?)'
    select = 'SELECT id FROM '+table+' WHERE val=?'
    qId = (val)=>
      id = cache.get(val)
      if id
        return id
      [id]  = await q select, val
      if id
        [ id ] = id
        cache.set(val, id)
        return id
      return
    (val)=>
      id = await qId val
      if id
        return id
      try
        r = await q(
          insert
          val
        )
        return r.insertId
      catch err
        if err?.errno == 1062
          return await qId(val)
        throw err
      return
