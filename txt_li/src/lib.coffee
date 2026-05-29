< (txt)=>
  txt.replaceAll('\r','\n').split('\n').map(
    (i)=>i.trim()
  ).filter(
    (i)=>i.length>0
  )
