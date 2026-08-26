< (args...)=>
  n = 0
  for i from args
    n += i.length
  m = new Uint8Array(n)
  n = 0
  for i from args
    m.set(i, n)
    n += i.length
  m
