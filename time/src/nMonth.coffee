> ./nYm.js

< (n)=>
  [y,m] = nYm n
  y + '-' + (
    (m+'').padStart(2, '0')
  )
