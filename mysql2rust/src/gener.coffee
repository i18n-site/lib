#!/usr/bin/env coffee

< =>
  GEN = []
  gen = (kind, name, sql)=>
    console.log kind,name
    if kind != 'function'
      return
    sql = sql.replace(/\sBEGIN\s/,'\nBEGIN\n').replace('\nRETURNS',' RETURNS')
    p = sql.indexOf '('
    end = sql.indexOf('\nBEGIN\n',++p)
    args = sql.slice(p, end)
    body = sql.slice(end)
    p = args.lastIndexOf ' RETURNS '
    if p<0
      return
    _return = args.slice(p+9).split('\n',1)[0]
    args = args.slice(0,p)
    args = args.slice(0,args.lastIndexOf(')')).split(',').map(
      (i)=>i.replaceAll('`','').trim()
    )
    _return_type = new Set()
    for i from body.split('\n')
      i = i.trim()
      if i.startsWith('RETURN ') and i.endsWith(';')
        _return_type.add i.slice(7,-1)

    option = 0
    if _return_type.has 'NULL'
      if _return_type.size == 1
        _return = ''
      else
        option = 1

    GEN.push [
      name
      args
      _return
      option
    ]
    return
  [GEN, gen]
