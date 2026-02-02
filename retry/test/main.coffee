#!/usr/bin/env coffee

> @3-/retry

test = retry =>
  console.log 'call test func'
  throw Error 'test'

test()
