render = (str, args...)=>
  new Function(
    ...args
    "return `#{str}`"
  )

String.prototype.render = (args...) ->
  d = args[0]
  if d instanceof Object
    render(this, ...Object.keys(d)) ...Object.values(d)
  else
    @replace(
      /\${(\d+)}/g
      (_, n)=> args[n]
    )
