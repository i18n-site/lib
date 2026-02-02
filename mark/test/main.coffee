#!/usr/bin/env coffee

> @3-/mark
  @3-/read
  path > join

ROOT = import.meta.dirname
md = read join ROOT, 'test.md'

console.log mark md

