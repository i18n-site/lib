< (li)=>
  ft = []
  for i from li
    ft.push [
      '\n'+i+':'
      '\n**<u>'+i+':</u>**'
    ]

  (txt)=>
    for [f,t] from ft
      txt = txt.replaceAll(f,t)
    txt
