< (title)=>
  pos = title.indexOf ':'
  if pos > 0
    return [
      title.slice(0, pos).trim()
      title.slice(pos + 1).trim()
    ]
  return title
