> @3-/urle:@ > urld
  ./REPLACE_EXT.js
  ./indexCssJs.js
  ./mime.js
  @3-/dbq > $one $q
  @3-/blake > blake3Hash
  @3-/ext
  @3-/intbin > binU64 u64Bin
  @3-/mreplace > Mreplace
  @3-/ossput
  @3-/pool > Pool
  @3-/read
  @3-/vb/vsE.js
  @3-/write
  fs > createReadStream
  path > join

INDEX_HTM = 'index.htm'


< (CDN, distdir, id_name, to_upload)=>
  put = ossput CDN
  upload = (distdir, id, name)=>
    try
      await put(
        urle(u64Bin id)
        =>
          createReadStream join(distdir,name)
        mime name
        name
      )
    catch err
      console.error name, err
      throw err
  id_name_li = [...id_name.entries()]
  id_name_li.sort((a,b)=>b[1].length-a[1].length)

  id_li = []
  name_li = []
  replace_li = []
  for [id,name] from id_name_li
    id = urle u64Bin id
    if name.startsWith('i18n/')
      name = name.slice(5)

    name_li.push name
    id_li.push id

    if REPLACE_EXT.includes(ext(name))
      replace_li.push name

  mreplace = Mreplace.from(name_li, id_li)
  for name from replace_li.concat [INDEX_HTM]
    fp = join distdir, name
    txt = read fp
    write(
      fp
      mreplace.replace(txt)
    )


  if to_upload.length
    pool = Pool 32
    for id in to_upload
      await pool upload, distdir, id, id_name.get(id)
    await pool.done

  css_js = indexCssJs(join(distdir,INDEX_HTM))
  [css,js] = css_js.map((bin)=>binU64 urld(bin))

  id_li = id_name_li.map(
    (i)=>i[0]
  )

  hash = Buffer.from blake3Hash vsE id_li

  {insertId:id} = await $q(
    'INSERT INTO v (hash,idLi,css,js,ts) VALUES (?,?,?,?,UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE id=id'
    blake3Hash vsE id_li
    vsE id_li.filter(
      (i)=>
        i!=css and i!=js
    )
    css
    js
  )

  id = Number id
  if not id
    id = await $one('SELECT id FROM v WHERE hash=?', hash)

  css_js = css_js.join(' ')
  await put(
    '.v'
    =>
      css_js
    'text/js'
  )
  console.log css_js
  # 上传 id 到 i18n.site/.v
  # console.log intBin(id)
  return css_js
