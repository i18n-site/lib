#!/usr/bin/env coffee

> path > join dirname
  @3-/write
  @3-/camel/Camel.js
  ./comm
  ./NAME

OUT = {}

for code in comm
  t = NAME.get(code)
  if not t
    console.log 'miss', code
  [zh, en, name] = t
  en = en.split('(')[0]
  console.log code, zh, en

  for [k,v] from Object.entries {en,zh,name,code}
    li = OUT[k]
    if not li
      OUT[k] = li = []
    li.push v

console.log li.length
PWD = import.meta.dirname
ROOT = dirname(PWD)
DIR_RUST = join PWD,'rust/src'

LANG_RS = [
  '''
use int_enum::IntEnum;
use strum::{EnumCount, EnumIter};

#[repr(u16)]
#[derive(
  EnumIter, Hash, PartialEq, Eq, Clone, Debug, Copy, IntEnum, EnumCount, Ord, PartialOrd
)]
pub enum Lang {
  '''
]

LANG_POS = []

for code, p in OUT.code
  LANG_RS.push '  '+Camel(code.toLowerCase())+' = '+p+','
  LANG_POS.push p

LANG_RS.push '}'
write(
  join DIR_RUST, 'lang.rs'
  LANG_RS.join('\n')+'''\n
pub const LANG: &[u32] = &['''+LANG_POS.join(',')+'];'
)


for [k,v] from Object.entries OUT
  kup = k.toUpperCase()
  write(
    join DIR_RUST,k+'.rs'
    'pub const '+kup+': &[&str] = &'+JSON.stringify(v)+';'
  )
  write(
    join(ROOT,'src', kup+'.js')
    'export default '+JSON.stringify(v)
  )

# li = []
# for i,pos in OUT.code
#   li.push pos
#
# li.sort((a,b)=>a-b)
# write(
#   join ROOT,'src/GEMINI.js'
#   'export default '+JSON.stringify(li)
# )
# write(
#   join DIR_RUST,'gemini.rs'
#   'pub const GEMINI: &[usize] = '+JSON.stringify(li) + ';'
# )
