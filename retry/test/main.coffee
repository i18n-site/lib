#!/usr/bin/env coffee

> ../src/index.js:retry

test = retry =>
  console.log 'call test func'
  throw Error 'test'

test()
