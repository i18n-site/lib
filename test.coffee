#!/usr/bin/env coffee

x = 3

while x < 32
  n = 0
  li = []
  while n <= x
    li.push "#{n} A#{n}"
    ++n
  li = li.join('; ')
  console.log "tuple2val!(#{li});"
  ++x

