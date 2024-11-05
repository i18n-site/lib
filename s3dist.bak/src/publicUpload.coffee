> @3-/blake > blake3Hash
  fs > readFileSync
  @3-/u8/u8eq.js
  @3-/ossput
  ./indexHtm.js
  path > join
  ./mime.js
  @3-/utf8/utf8d.js
  @3-/utf8/utf8e.js
  @3-/pool > Pool
  @3-/dbq > $q $e

< (cdn_host, s3, dir, li, public_refresh)=>
  name_li = []

  for i from li
    if i.isFile()
      name_li.push i.name

  exist = new Map

  for [name,hash] from await $q('SELECT name,hash FROM pub WHERE name IN (?)',name_li)
    exist.set utf8d(name),hash
  # for {name,hash} from await db('pub').select('name','hash').whereIn(
  #   'name'
  #   name_li
  # )

  file_li = [
    ['index.htm',utf8e(await indexHtm(cdn_host))]
  ]

  for i from name_li
    file_li.push [
      i
      readFileSync join(dir, i)
    ]

  name_hash = []
  to_upload = []
  args = []

  for [name,txt] from file_li
    hash = Buffer.from blake3Hash txt
    h = exist.get(name)
    if h and u8eq(hash, h)
      continue
    to_upload.push [name,txt]
    name_hash.push(name,hash)
    args.push '(?,?)'

  if not to_upload.length
    return

  put = ossput s3

  pool = Pool 9

  for [name,txt] from to_upload
    await pool(
      put
      name
      =>
        txt
      mime name
    )

  await pool.done
  await public_refresh(to_upload.map(([name])=>name))

  await $e(
    "INSERT INTO pub (name,hash) VALUES #{args.join(',')} ON DUPLICATE KEY UPDATE hash=VALUES(hash)"
    ...name_hash
  )
  return
