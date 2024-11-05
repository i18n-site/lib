import {opendir, readlink, stat} from 'fs/promises'
import {dirname, join, normalize} from "path"

walk = (dir, ignore = =>, meta = undefined) ->
  if meta
    [exist, root] =  meta
  else
    exist = new Set()
    root = dir

  for await d from await opendir(dir)
    entry = join(root, d.name)
    if ignore(entry)
      continue

    if d.isDirectory()
      yield from walk(entry, ignore, [exist, join(root,d.name)])
    else if (d.isFile())
      yield entry
    else if d.isSymbolicLink()
      p = await readlink(entry)
      if not p.startsWith '/'
        p = normalize join dir, p
      try
        s = await stat(p)
      catch err
        continue
      if s.isDirectory()
        if exist.has p
          continue
        exist.add p
        for await i from walk(p, ignore, [exist, join(root, d.name)])
          yield i
      else if s.isFile()
        yield entry
  return

if process.platform == 'win32'
  _walk = walk
  walk = (...args)->
    for await i from _walk.apply(this,arguments)
      yield i.replaceAll '\\','/'
    return

export default walk

export walkRel = (dir, ignore) ->
  len = dir.length + 1
  if ignore
    _ignore = (p)=>
      ignore p[len..]

  for await d from walk(dir, _ignore)
    yield d[len..]

  return
