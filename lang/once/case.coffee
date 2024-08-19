#!/usr/bin/env coffee
#
import CASE from '../src/CASE.js'

> @3-/write
  path > join
  os > homedir

HOME = homedir()

write(
  join HOME,'i18n/rust/lang/src/case.rs'
  "pub const CASE:[bool;#{CASE.length}] ="+JSON.stringify(CASE.map(
    (i)=> !!i
  ))+';'
)
