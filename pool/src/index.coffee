> os > cpus

< Pool = (max=cpus().length*2)=>
  ing = 0
  todo = []

  + done, all_done, all_reject
  _init_done = =>
    done = new Promise (resolve, reject)=>
      all_done = resolve
      all_reject = reject
      return
    return

  f = (func, args...)=>
    r = new Promise (resolve, reject)=>
      todo.push [resolve, reject, func, args]
      return

    if ing < max # 不到 max 不阻塞
      if ing == 0
        _init_done()
      ++ing

      p = do =>
        while todo.length
          [resolve,reject,func,args] = todo.shift()
          await func(...args).catch(reject)
          resolve()
        return

      p.catch all_reject
      p.finally =>
        --ing
        if ing == 0
          all_done()
        return
      return

    return r

  Object.defineProperty(
    f
    'size'
    writeable:false
    get:=>
      max
    set:(val)=>
      max = Math.max(1, val)
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
