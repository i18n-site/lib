< (fp)=>
  p = fp.lastIndexOf '.'
  if ~p
    return fp.slice(p+1)
  return ''
