< (q)=>
  (table)=>
    insert = 'INSERT INTO '+table+'(val) VALUES (?)'
    select = 'SELECT id FROM '+table+' WHERE val=?'
    qId = (val)=>
      [id]  = await q select, val
      if id
        return id[0]
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
