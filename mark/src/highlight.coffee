# https://github.com/orgs/community/discussions/16925

export default (htm)=>
  prefix = '<blockquote><p>[!'
  p = 0
  pre = 0
  li = []
  `out: //`
  loop
    begin = p = htm.indexOf(prefix, p)
    max = htm.length
    if ~p
      p = p + prefix.length
      t = []
      while p < max
        c = htm.charCodeAt(p)
        if c == 93
          if t.length
            li.push htm.slice(pre,begin+11).trimStart() + ' class="'+t.join('')+' M"><p>'
            pre = ++p
          break
        else if not (c >= 65 && c <= 90)
          continue out
        t.push htm.charAt(p++)
    else
      break
  li.push htm.slice(pre).trimStart()
  li.join('')

