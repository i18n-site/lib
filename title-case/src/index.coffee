< (str) =>
  upper = 1
  newStr = ""
  for char from str
    if " -".includes(char)
      upper = 1
      newStr += char
      continue
    newStr += if upper then char.toUpperCase() else char
    upper = 0
  newStr

