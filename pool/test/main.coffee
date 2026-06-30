#!/usr/bin/env coffee

> @3-/pool > Pool
  @3-/sleep:sleep

pool = Pool 5

job = (n)=>
  console.log n
  await sleep 100*n
  console.log 'done\t',n

n = 0
pool.max = 2
while ++n<10
 await pool job,n

console.log 'pool 1 done'

pool.max = 5

n = 0

while ++n<10
 await pool job,n

await pool.done
process.exit()
