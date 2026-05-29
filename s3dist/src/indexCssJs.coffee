> path > join
  @3-/read
  @3-/extract > extract

< (index) =>
  console.log index
  # '<script type=module crossorigin src=/a></script><link rel=stylesheet crossorigin href=/j>'
  htm = read(index)
  css = extract(htm,'href=','>')
  js = extract(htm,'src=','>')
  [css,js].map (i)=>
    i.slice(i.lastIndexOf('/')+1)

