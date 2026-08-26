< (msg)=>
  if Array.isArray msg
    if msg.length
      msg = msg.join('\n')
    else
      return
  throw new Error msg
