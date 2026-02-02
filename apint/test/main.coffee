#!/usr/bin/env coffee

> @3-/apint > gen_nt
  @3-/read
  path > join

ROOT = import.meta.dirname

rs = read join ROOT,'test.rs'

nt = gen_nt(rs,'')
console.log nt
