< colored = (color)=>
  prefix = '\x1B['+color+'m'
  (i)=>
    prefix+i+'\x1B[0m'

< (colorer, log)=>
  (...args)=>
    li = []
    for i from args
      li.push colorer(i)
    log ...li

