export default (begin, end, html)->
  len = begin.length
  end_len = end.length
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

