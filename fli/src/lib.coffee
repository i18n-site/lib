< (li, get, pos) ->
  pending = new Map()
  result_cache = new Map()
  next_index = pos

  _run = (index) =>
    url = li[index]
    try
      return [
        index
        [
          await get(url)
        ]
      ]
    catch err
      return [index,[,err]]

  run = (index)=>
    pending.set(index, _run(index))
    return

  lilen = li.length

  while pending.size < 5 and pos < lilen
    run(pos++)

  while pending.size > 0
    [_pos, result] = await Promise.any(pending.values())
    pending.delete(_pos)
    if _pos == next_index
      yield result
      ++next_index
      loop
        t = result_cache.get(next_index)
        if t
          result_cache.delete(next_index++)
          yield t
        else
          break
    else
      result_cache.set(_pos, result)
    if pos < lilen
      run(pos++)

  return





