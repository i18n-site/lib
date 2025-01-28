#!/usr/bin/env coffee

import walk, {walkRel} from '@3-/walk'
import {dirname} from 'path'

{pathname} = new URL(import.meta.url)

dir = dirname dirname pathname

console.log dir

console.log '> full path'
for await i from walk(dir,(i)=>i.includes 'node_modules')
  console.log i

console.log '\n> relative path'
for await i from walkRel(
  dir
  (i)=>
    ['src','node_modules'].includes i
)
  console.log '\t',i
