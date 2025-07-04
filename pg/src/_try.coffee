#!/usr/bin/env coffee

> ansis > red redBright greenBright gray

DEBUG = process.env.NODE_ENV != 'production'

sql_escape = (i)=>
  if i instanceof Uint8Array
    return '\'\\x'+Buffer.from(i).toString('hex')+'\'::bytea'
  switch typeof i
    when 'string'
      return '\''+i.replaceAll('\'','\\\'')+'\''
  if i
    {value} = i
    if value
      if Array.isArray value
        return "ARRAY[" + value.map(sql_escape).join(",") + "]"
      return value

  if Array.isArray(i)
    r = []
    for j from i
      r.push sql_escape j
    return r

  if i?.first
    return i.first

  return JSON.stringify i

_sql = (args)=>
  li = []
  for i from args[1..]
    if Array.isArray(i) and i[0]?.first
      t = []
      for {first,rest} from i
        t.push "(" + rest.join(",") + ") VALUES "
        tli = []
        if Array.isArray(first)
          for k from first
            t2 = []
            for l from rest
              t2.push sql_escape(k[l])
            tli.push '('+t2.join(',')+')'
        else
          t2 = []
          for k from rest
            t2.push sql_escape first[k]
          tli.push '('+t2.join(',')+')'
        t.push tli.join(',')
      li.push t.join('')
    else
      first = i?.first
      if first
        if Array.isArray first
          li = li.concat first.map sql_escape
        else
          cli = []
          vli = []
          for [k,v] from Object.entries(first)
            cli.push k
            vli.push sql_escape v
          li.push "(#{cli.join(',')}) VALUES (#{vli.join(',')})"
      else
        i = sql_escape i
        if Array.isArray(i)
          li.push ...i
        else
          li.push i

  r = []

  sql = args[0]

  if Array.isArray sql
    for i,pos in sql
      r.push i
      r.push li[pos]
    return r.join ''

  return sql.replace(
    /(\$\d+)/g
    (x)=>
      return li[x[1..]-1]
  )


if DEBUG
  _try = (func)=>
    (args...)=>
      begin = new Date
      try
        r = await func.apply(func, args)
      catch err
        console.trace()
        console.error redBright err.message
        console.error red _sql args
        throw err
        return

      console.log gray(
        Math.round(new Date - begin)/1000+'s'
      ),greenBright _sql args
      r
else
  _try = (func)=>
    (args...)=>
      try
        return await func.apply(func, args)
      catch err
        console.trace()
        console.error redBright err.message
        console.error red _sql args
        throw err
      return

< default _try
