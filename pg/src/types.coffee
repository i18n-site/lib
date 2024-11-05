#!/usr/bin/env coffee


parseInt = Number.parseInt.bind Number

parseBigInt = (n)=>
  if n > Number.MAX_SAFE_INTEGER or n < Number.MIN_SAFE_INTEGER
    return BigInt(n)
  return parseInt n

< (uint)=>
  types = {}
  for [val,name] from uint
    if ['u64','i64','bigint'].includes(name)
      parse = parseBigInt
    else
      parse = parseInt
    types[name] = {
      to:val
      from:[val]
      serialize:(x)=>x.toString()
      parse
    }
  types
