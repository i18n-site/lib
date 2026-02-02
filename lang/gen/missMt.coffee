#!/usr/bin/env coffee

> ./qwen3Mt
  ../lib/CODE.js

all_code = new Set
code_cn = new Map
for [en,cn,code] from qwen3Mt
  all_code.add code
  code_cn.set code,cn

miss_code = new Set
for i from CODE
  if not all_code.delete i
    miss_code.add i


for i from all_code
  console.log i, code_cn.get(i)
console.log 'miss', miss_code
