< (get)->
  page = 0
  loop
    li = await get(++page)
    if li?.length
      yield from li
    else
      break
  return
