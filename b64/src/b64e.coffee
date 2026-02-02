< (bytes)=>
  s = btoa(String.fromCodePoint(...bytes))
  pad = bytes.length % 3
  if pad
    s = s.slice(0,pad-3)
  s
