#!/usr/bin/env coffee

> ../src/CODE.js
  @3-/uridir
  @3-/write
  json5
  path > join dirname


ROOT = dirname uridir(import.meta)


write(
  join ROOT, '../../rust/lang/src/code_id.rs'
'''
// gen by node/lang/once/gen.coffee

use phf::{OrderedSet,phf_ordered_set};

pub static CODE_ID: OrderedSet<&'static str> = phf_ordered_set! {
'''+JSON.stringify(CODE).slice(1,-1)+'};'
)


