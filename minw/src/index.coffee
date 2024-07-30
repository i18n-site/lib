< (b)=>
  {clientWidth:w, clientHeight:init_h} = b
  step = 64
  if w < step
    return
  loop
    b.style.width = (w-step)+'px'
    # 写这里保证最后一次w也设置上了
    if not step
      break
    if b.clientHeight == init_h
      w -= step
    else
      step = Math.floor(step/2)
  return
