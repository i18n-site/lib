> @3-/redis/R.js
  @3-/write
  @3-/read
  @3-/yml/index.js > load
  @3-/u8/u8merge.js
  @3-/utf8/utf8e.js
  @3-/intbin > u64Bin
  @3-/lang/CODE_ID.js
  @3-/snake > SNAKE
  path > join basename dirname
  fs > existsSync readdirSync

const_bytes = (key)=>
  "pub const #{SNAKE key}: &[u8] = b#{JSON.stringify(key)};"

ignore = (i)=>
  i = basename(i)
  i.startsWith('.') or ['node_modules'].includes(i)

kv = (dir, lang_set)=>
  file_set = new Set
  prefix = basename dirname dir
  for lang from lang_set
    pwd = join dir, lang
    o = {}
    i18n_yml = join pwd, 'i18n.yml'
    if existsSync i18n_yml
      for [k,v] from Object.entries load i18n_yml
        o[k] = v

    file_li = readdirSync pwd
    for fp from file_li
      if fp.endsWith('.md') and not fp.startsWith('.')
        file_set.add fp
        md = read join pwd, fp
        o[fp.slice(0,-3)] = md

    lang_id = CODE_ID.get(lang)
    if lang_id != undefined
      key = Buffer.from u8merge(
        utf8e(prefix+'I18n:')
        u64Bin lang_id
      )
      await R.hmset key, o
    else
      console.error("unkown lang #{lang}")

  i18nRs(dir, file_set, lang_set)
  return

i18nRs = (dir, file_set, lang_set)=>
  i18n = []
  for lang from lang_set
    pwd = join dir, lang
    i18n_yml = join pwd, 'i18n.yml'
    if existsSync i18n_yml
      keys = Object.keys load i18n_yml
      for key from keys
        i18n.push const_bytes key
    for fp from file_set
      i18n.push const_bytes fp.slice(0,-3)
    break


  if not i18n.length
    return

  project = dirname(dir)

  rs = [
    """
// gen by @3-/i18n-rust ; DON'T EDIT

use r::{
  fred::interfaces::{HashesInterface, RedisResult},
  R,
};

#{i18n.join("\n\n")}

#[macro_export]
macro_rules! throw {

  ($header:ident,$id:ident,$key:ident) => {{
    $crate::i18n::throw(&$header, stringify!($id), $crate::i18n::$key).await?;
    unreachable!()
  }};

  ($header:ident,$id:ident,$($key:ident),+) => {{
    $crate::i18n::throw_li(&$header, stringify!($id), &[
      $($crate::i18n::$key),+
    ]).await?;
    unreachable!()
  }};

}


""" + "::i18n::gen!(#{basename project});"
  ]

  outfp = join(project, 'src/i18n.rs')
  write(
    outfp
    rs.join('\n\n')
  )

  console.log outfp
  return

< (dir, lang_set)=>
  await kv(dir, lang_set)
  return
