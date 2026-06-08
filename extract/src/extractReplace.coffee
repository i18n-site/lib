#!/usr/bin/env coffee

export default (begin, end, replace, html)=>
  p = html.indexOf begin
  if p < 0
    return
  p+=(begin.length)
  if end
    e = html.indexOf end,p
    if e < 0
      return
    return html[...p] + replace(html[p...e])+ html[e..]
  return html[...p] + replace(html[p..])
