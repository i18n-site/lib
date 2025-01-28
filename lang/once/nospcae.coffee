#!/usr/bin/env coffee

> ../src/NOSPACE.js
  ../src/CODE.js
  @3-/uridir
  @3-/write
  path > join dirname


ROOT = dirname uridir(import.meta)

li = [...NOSPACE].map((i)=>CODE.indexOf(i))
li.sort((a,b)=>a-b)

write(
  join ROOT, '../../rust/lang/src/nospace.rs'
"""
// gen by node/lang/once/gen.coffee

pub const NOSPACE: [u8; #{li.length}] =
"""+JSON.stringify(li)+';'
)


