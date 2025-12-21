> @3-/caller_line
  @3-/sleep

< (fn)=>
  caller = CallerLine()
  ->
    n = 0
    loop
      try
        return await fn.apply(@,arguments)
      catch err
        console.error '\n'+caller+'\n', fn, ...arguments
        console.trace(err)
        console.error '\n❯ retry '+n+'\n'
        if ++n > 9
          throw err
        await sleep 999
    return
