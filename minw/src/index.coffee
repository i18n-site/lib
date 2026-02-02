< (b)=>
  {
    clientWidth
    clientHeight:init_h
  } = b
  w = clientWidth
  step = 64
  if w < step
    return
  loop
    # 写这里保证最后一次w也设置上了
    if not step
      b.style.width = Math.min(
        w+8
        clientWidth-8
      )+'px'
      break
    b.style.width = (w-step)+'px'
    if b.clientHeight == init_h
      w -= step
    else
      step = Math.floor(step/2)
  return
