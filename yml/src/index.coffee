> js-yaml:yaml
  @3-/read
  @3-/write

{load:loads,dump:dumps} = yaml

< loads = loads
< dumps = dumps

< load = (fp)=>
  try
    return loads read fp
  catch err
    msg = fp
    {mark} = err
    if mark
      {snippet} = mark
      msg += '\n'+snippet
      err = new Error err.reason
    console.error msg
    throw err
  return

< dump = (fp, o)=>
  write fp, dumps(o)

