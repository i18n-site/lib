< (func, timeout)=>
  (url,opt)=>
    ctrl = new AbortController()
    timer = setTimeout(
      =>
        ctrl.abort()
        return
      timeout
    )
    opt = opt or {}
    opt.signal = ctrl.signal
    try
      return await func(url,opt)
    finally
      clearTimeout timer
    return
