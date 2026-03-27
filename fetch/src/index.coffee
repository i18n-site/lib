< (args...)=>
  r = await fetch ...args
  switch r.status
    when 200, 301, 304
      return r
  throw r
  return
