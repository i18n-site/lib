#!/usr/bin/env coffee

> @3-/read/rJson.js
  path > join dirname

{dirname:dir} = import.meta

dir = dirname dir

console.log dir
o = rJson join(dir,'package.json')
console.log o
console.log o.name
