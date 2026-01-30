minute = (n)=>
  if n < 60
    Number.parseInt(n/1e3) + ' 秒'
  (n/6e4).toFixed(2) + ' 分'

< (total)=>
  begin = new Date
  runed = 0
  =>
    cost = new Date - begin
    console.log ++runed + ' / ' + total + ' 进度 ' +  (100*runed/total).toFixed(2)+'%' + ' 还需 ' +  minute((total-runed)*cost/runed)
    return
