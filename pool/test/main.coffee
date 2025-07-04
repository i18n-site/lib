#!/usr/bin/env coffee

> @3-/pool > Pool
  @3-/sleep:sleep

pool = Pool 5

job = (n)=>
  console.log n
  await sleep 100*n
  throw n
  console.log 'done\t',n

n = 0
pool.size = 2
while ++n<10
 await pool job,n

pool.size = 5
n = 0
while ++n<10
 await pool job,n

await pool.done
