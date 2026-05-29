< (n)=>
  if n < 100
    n + 's'
  else if n < 6e3
    Math.round(n / 60)+'m'
  else if n < 36e4
    (n/3600).toFixed(2)+'h'
  else
    Math.round(n / 86400)+'d'
