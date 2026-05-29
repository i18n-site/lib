#!/usr/bin/env coffee

> path > join
  @3-/read
  ../lib/sqlLi.js


ROOT = import.meta.dirname

for table from [
  '3ti'
  'alive'
]
  console.log '→',table
  sql = read join ROOT, table+'.sql'
  for i from sqlLi(sql)
    console.log i
