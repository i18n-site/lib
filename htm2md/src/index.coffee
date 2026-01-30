> lodash-es > unescape

htm2md = (txt)=>
  txt.replace(
    /([^\\])```/g,'$1\\```'
  ).replace(
    /<strong>(.*?)<\/strong>/g,
    "**$1**"
  ).replace(
    /<em>(.*?)<\/em>/g,
    "*$1*"
  ).replace(
    /<del>(.*?)<\/del>/g,
    "~~$1~~"
  ).replace(
    /<code>(.*?)<\/code>/g, (_, s)=>
      s = s.replaceAll('\\```','```')
      if s.startsWith '```'
        s = ' '+s
      '`'+s+'`'
  ).replace(
    /<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)'
  )

< (htm)=>
  if htm.indexOf('<') < 0
    return unescape htm

  p = htm.indexOf('>')
  if p > 0
    tag = htm.slice(1,p++)
    if tag.startsWith('h') and tag.length == 2
      n = parseInt tag.charAt(1)
      if n
        return '#'.padEnd(n) + ' ' + htm2md htm.slice(p,-5)
    if tag == 'p'
      return htm2md htm.slice(p, -4)
    if tag.startsWith 'img'
      if htm.indexOf(' style="') < 0
        return htm.replace(
          /<img src="([^"]+)" alt="([^"]+)"\s*\/?>/g, '![$2]($1)'
        )
      else
        return htm

  htm2md htm
