#!/usr/bin/env coffee

> @3-/bsearch

li  = [1, 3, 5, 8, 9]
for n from [0,3,6,10,0,-1,-11]
  pos = bsearch li, n
  console.log 'find',n,'pos',pos,'li[pos]',li[pos]

