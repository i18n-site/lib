> progress:Bar
  util > inspect
  ansis > gray

< (total)=>
  bar = new Bar(
    ':percent :bar :current/:total COST :elapseds ETA :etas'
    {
      total
      complete: '━'
      incomplete: gray '─'
    }
  )

  tick = (n)=>
    bar.tick(n)

  tick.log = (...args)=>
    r = []
    for i from args
      if typeof(i) != 'string'
        i = inspect i
      r.push i
    bar.interrupt gray r.join(' ')

  tick
