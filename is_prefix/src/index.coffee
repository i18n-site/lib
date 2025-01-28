< (prefix, url)=>
  if prefix
    return (url == prefix) or url.startsWith(prefix + '/')
  1
