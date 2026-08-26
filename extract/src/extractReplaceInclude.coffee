#!/usr/bin/env coffee

export default (begin, end, replace, html)=>
  p = html.indexOf begin
  if p < 0
    return
  if end
    e = html.indexOf end,p+begin.length
    if e < 0
      return
    e += end.length
    return html[...p] + replace(html[p...e])+ html[e..]
  return html[...p] + replace(html[p..])
