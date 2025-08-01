#!/usr/bin/env coffee

> @3-/cache

test = cache (a)=>
  console.log 'run test',a
  a+2


console.log test 123
console.log test 123
