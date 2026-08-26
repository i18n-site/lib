> @3-/pg/PG.js > ONE EXE UNSAFE
  ./INIT_SQL.js
  ./upload.js
  ./INIT_PUB.js
  path > join
  @3-/read
  ./minName.js
  ./publicUpload.js

export default (
  root
  s3_public, public_refresh
  s3_cdn
)=>
  dist = join root, 'dist'
  {name, version} = JSON.parse read(join root, 'package.json')

  console.log name, version

  max = 3
  while --max
    try
      [site_id, upload_id] = await ONE"SELECT * FROM site_id_upload_id(#{name})"
      break
    catch e
      if e.code == '42883'
        console.log 'INIT DB'
        await UNSAFE(INIT_SQL+INIT_PUB)
      else
        throw e

  ignore = await publicUpload(
    root, site_id, s3_public, public_refresh
  )
  arg = await minName(
    site_id
    dist
    ignore
  )
  return upload(
    site_id
    upload_id
    dist
    s3_cdn
    ...arg
  )

