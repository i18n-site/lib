< (n, li)=>
  r  = []
  iter = li[Symbol.iterator]()
  for i from iter
    t = [i]
    x = n
    while --x
      t.push iter.next().value
    r.push t
  r


