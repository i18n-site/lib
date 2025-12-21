> os > cpus

< Pool = (max=cpus().length*2)=>
  ing = 0
  todo = []

  { promise:done, resolve:all_done, reject: all_reject } = Promise.withResolvers()

  boot = =>
    p = do =>
      while todo.length and ing <= max
        [resolve,reject,func,args] = todo.shift()
        try
          await func(...args).then(resolve, reject)
        catch e
          console.error args, e
      return
    p.catch all_reject
    p.finally =>
      if ing > max
        --ing
        return
      # 避免 todo 又被 push 了
      setTimeout =>
        if todo.length
          boot()
          return
        if --ing == 0
          all_done()
        return
      return
    return

  f = (func, args...)=>
    r = new Promise (resolve, reject)=>
      todo.push [resolve, reject, func, args]
      return

    if ing < max # 不到 max 不阻塞
      ++ing
      boot()
      return

    return r

  Object.defineProperty(
    f
    'max'
    writeable:false
    get:=>
      max
    set:(val)=>
      val = Math.max(1, val)
      if val > max
        len = todo.length
        while ing < val and len > 0
          ++ing
          --len
          boot()
      max = val
      return
  )

  Object.defineProperty(
    f
    'done'
    writeable:false
    get:=>
      if ing == 0
        return
      done
  )
  f
