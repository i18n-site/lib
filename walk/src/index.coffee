import {opendirSync, readlinkSync, statSync} from 'fs'
import {dirname, join, normalize} from "path"

walk = (dir, ignore = =>, meta = undefined) ->
  if meta
    [exist, root] =  meta
  else
    exist = new Set()
    root = dir

  opened = opendirSync dir
  try
    loop
      d = opened.readSync()
      if not d
        break
      entry = join(root, d.name)
      if ignore(entry)
        continue

      if d.isDirectory()
        yield from walk(entry, ignore, [exist, join(root,d.name)])
      else if (d.isFile())
        yield entry
      else if d.isSymbolicLink()
        p = readlinkSync(entry)
        if not p.startsWith '/'
          p = normalize join dir, p
        try
          s = statSync(p)
        catch err
          continue
        if s.isDirectory()
          if exist.has p
            continue
          exist.add p
          for i from walk(p, ignore, [exist, join(root, d.name)])
            yield i
        else if s.isFile()
          yield entry
  finally
    opened.closeSync()
  return

if process.platform == 'win32'
  _walk = walk
  walk = (...args)->
    for i from _walk.apply(this,arguments)
      yield i.replaceAll '\\','/'
    return

export default walk

export walkRel = (dir, ignore) ->
  len = dir.length + 1
  if ignore
    _ignore = (p)=>
      ignore p[len..]

  for d from walk(dir, _ignore)
    yield d[len..]

  return
