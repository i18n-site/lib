#!/usr/bin/env coffee

< extractLi = (html, begin, end)->
  len = begin.length
  end_len = 1+end.length
  p = 0

  loop
    p = html.indexOf begin, p
    if p < 0
      break
    p += len
    e = html.indexOf end,p
    if e < 0
      break
    yield html[p...e]
    p = end_len + e
  return

< extract = (html, begin, end)->
  p = html.indexOf begin
  if p < 0
    return
  p+=(begin.length)
  e = html.indexOf end,p
  if e < 0
    return
  html[p...e]
