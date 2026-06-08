< (s)=>
  if s.length
    t = []
    + up, pre_is_up

    for i in s
      if i == '-'
        up = true
        continue

      if i == '_'
        if not pre_is_up
          up = true
          continue

      up_case = i.toUpperCase()
      if up
        i = up_case
        up = undefined
        pre_is_up = true
      else if '9876543210'.includes(i)
        pre_is_up = false
      else
        pre_is_up = i == up_case
      t.push i

    t.join('')
  else
    s
