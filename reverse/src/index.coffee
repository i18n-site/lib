# "A☺️B".split() = ['A', '☺', '️', 'B'] , 所以不能直接用 split reverse
< (s)=>
  return [...s].reverse().join('')
