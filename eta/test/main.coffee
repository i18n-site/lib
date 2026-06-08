#!/usr/bin/env coffee

> @3-/eta
  @3-/sleep

process = eta(10)

n = 0

while ++n < 10
  process()
  await sleep 1e2
