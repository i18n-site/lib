< (txt)=>
  txt.split('\n').map(
    (i)=>i.trim()
  ).filter(
    (i)=>i.length>0
  )
