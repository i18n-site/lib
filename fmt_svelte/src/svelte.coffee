> ./pug.js
  ./styl.js

getLang = (li)=>
  for i from li
    [k,v] = i.split('=')
    if k == 'lang'
      return v.replaceAll('"','')
  return


< (svelte) =>
  result = []

  + t, end_tag, fmt

  setEnd = (tag)=>
    t = []
    end_tag = '</'+tag+'>'
    return

  for i from svelte.split '\n'
    i = i.trimEnd()
    if t
      if i == end_tag
        t = t.join('\n')
        if fmt
          try
            t = await fmt(t)
          catch err
            throw new Error(
              t + '\n' + tag + ': '+ err
            )
        result.push t.trim()
        result.push i
        t = fmt = undefined
      else
        t.push i
    else
      result.push i
      if i.startsWith('<') and i.endsWith('>')
        i = i.slice(1,-1).split(' ')
        tag = i.shift().trim()
        switch tag
          when 'template'
            if getLang(i) == 'pug'
              fmt = pug
          when 'style'
            if getLang(i) == 'stylus'
              fmt = styl
        setEnd tag
  if t?.length
    result = result.concat t
  # return
  return result.join('\n').trim()
