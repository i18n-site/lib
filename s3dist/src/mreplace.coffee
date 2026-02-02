> ./CONST.js > INDEX_HTM
  @3-/mreplace > Mreplace
  path > join
  @3-/ext
  @3-/read
  @3-/write
  ./REPLACE_EXT.js
# > @3-/urle:@ > urld
#   ./REPLACE_EXT.js
#   ./indexCssJs.js
#   ./mime.js
#   @3-/blake > blake3Hash
#   @3-/ext
#   @3-/intbin > binU64 u64Bin
#   @3-/mreplace > Mreplace
#   @3-/ossput
#   @3-/pool > Pool
#   @3-/vb/vsE.js
#   fs > createReadStream

< (dist, id_li, name_li, ts_li)=>
  # put = ossput CDN
  # upload = (distdir, id, name)=>
  #   try
  #     await put(
  #       urle(u64Bin id)
  #       =>
  #         createReadStream join(distdir,name)
  #       mime name
  #       name
  #     )
  #   catch err
  #     console.error name, err
  #     throw err
  # id_name_li = [...id_name.entries()]
  # id_name_li.sort((a,b)=>b[1].length-a[1].length)

  _id_li = []
  _name_li = []
  replace_li = []
  for name, pos in name_li
    if not ts_li[pos]
      if REPLACE_EXT.includes(ext(name))
        replace_li.push name

    id = id_li[pos]
    _name_li.push if name.startsWith('i18n/') then name.slice(5) else name
    _id_li.push id

  mreplace = Mreplace.from(_name_li, _id_li)
  for name from replace_li.concat [INDEX_HTM]
    fp = join dist, name
    txt = read fp
    write(
      fp
      mreplace.replace(txt)
    )
  return
