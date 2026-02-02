> @3-/read
  @3-/write
  fs > existsSync
  js-yaml > dump load

< (yml_fp, id_yml_fp)=>
  used = {}
  + changed
  yml = load read(yml_fp)

  if existsSync id_yml_fp
    key_id = load(read id_yml_fp)
  else
    key_id = {}

  id_incr = 0
  for [k, v] from Object.entries yml
    for i from Object.values v
      if i > id_incr
        id_incr = i

  for [k, v] from Object.entries yml
    kid = key_id[k]
    if not kid
      key_id[k] = kid = {}
    used[k] = uk = {}
    for vk from Object.keys v
      id = kid[vk]
      if not id
        id = ++id_incr
        kid[vk] = id
        changed = 1
      uk[vk] = id
  if changed
    write(
      id_yml_fp
      dump key_id
    )
  return used







