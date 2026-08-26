> @3-/blake3 > blake3

< (q)=>
  qId = (hash)=>
    [id]  = await q 'SELECT id FROM txt WHERE hash=?', hash
    if id
      return id[0]
  (txt)=>
    hash = blake3 txt
    id = await qId hash
    if id
      return id
    try
      r = await q(
        'INSERT INTO txt (val, hash) VALUES (?,?)'
        txt, hash
      )
      return r.insertId
    catch err
      if err?.errno == 1062
        return await qId(hash)
      throw err
    return
