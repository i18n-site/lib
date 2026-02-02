split = '_'

snake = (s)=>
  if s.length

    s0 = s[0]
    begin = s0.toLowerCase()
    t = [begin]
    pre_is_upper = begin != s0

    for i in s[1..]
      l = i.toLowerCase()
      if l != i
        if pre_is_upper
          t.push l
        else
          if t[t.length-1]!='_'
            t.push '_'
          t.push l
          pre_is_upper = true
      else if i == '-'
        t.push '_'
      else
        t.push i
        pre_is_upper = false
    t.join('')
  else
    s

export default snake

export SNAKE = (s)=>
  snake(s).toUpperCase()
