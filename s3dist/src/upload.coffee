> ./mime.js
  @3-/ossput
  @3-/blake > blake3Hash
  fs > createReadStream
  path > join
  @3-/pg/PG.js > EXE Q ONE0
  ./CONST.js > INDEX_HTM
  ./indexCssJs.js

uploadV = (site_id, uploaded_id, put, css_js) =>
  hash = blake3Hash css_js

  len = css_js.length
  max = 3
  while --max
    id = id or await ONE0"SELECT id FROM upload WHERE hash=#{hash} AND len=#{len} AND site_id=#{site_id}"

    if id
      if id == uploaded_id
        return
      await EXE"UPDATE site SET upload_id=#{id} WHERE id=#{site_id}"
      return

    await put(
      ".v"
      => css_js
      ""
    )

    id = await ONE0"INSERT INTO upload(id,site_id,hash,len) VALUES ((SELECT nextId('upload')),#{site_id},#{hash},#{len}) RETURNING id"
  return

export default (
  site_id, uploaded_id, dist, s3_cdn
  e_id_li
  id_li, rel_li, ts_li
)=>
  put = ossput s3_cdn
  uploaded = []
  ing = []

  upload = =>
    await Promise.all(ing)
    await EXE"UPDATE upload SET ts=EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::bigint WHERE id IN #{Q uploaded}"
    return

  for ts, p in ts_li
    if ts
      continue
    rel = rel_li[p]
    if ts == 0
      uploaded.push id_li[p]
      ing.push put(
        e_id_li[p]
        =>
          console.log '>',rel
          createReadStream join dist, rel
        mime(rel)
      )
      if ing.length > 64
        await upload()
        ing = []
        uploaded = []

  if ing.length
    await upload()

  css_js = indexCssJs(
    join dist, INDEX_HTM
  )
  css_js = css_js.join(' ')
  await uploadV site_id, uploaded_id, put, css_js
  return css_js

