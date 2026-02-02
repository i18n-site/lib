#!/usr/bin/env coffee

export default (begin, end, html)=>
  p = html.indexOf begin
  if p < 0
    return
  p+=(begin.length)
  if end
    e = html.indexOf end,p
    if e < 0
      return
    return html[p...e]
  return html[p..]
