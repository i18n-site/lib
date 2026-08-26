#!/usr/bin/env coffee

> @3-/bar
  @3-/sleep

n = 30

BAR = bar n

while --n
  BAR()
  BAR.log '>', n, new Date
  await sleep 500

