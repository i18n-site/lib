export default (begin, end, html)->
  len = begin.length
  end_len = end.length
  pre = 0
  p = 0
  loop
    # console.log '\t',html.slice(0,p)
    p = html.indexOf begin, p
    if p < 0
      break
    yield [0,html.slice(pre,p+begin.length)]
    p += len
    e = html.indexOf end,p
    if e < 0
      break
    yield [1, html.slice(p,e)]
    pre = e
    p = end_len + e
  yield [0,html.slice(pre)]
  return

