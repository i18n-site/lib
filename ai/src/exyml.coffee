#!/usr/bin/env coffee
> ./txt2yml.js

export default (func, args...)=>
  retry = 0
  loop
    r = await func(...args)
    try
      return txt2yml r
    catch e
      if ++retry > 9
        throw [r,e]
      console.error r+'\n', e
  return
