#!/usr/bin/env coffee

> @3-/ymlid
  path > join

ROOT = import.meta.dirname

console.log ymlid(
  join ROOT,'test.yml'
  join ROOT,'id.yml'
)
