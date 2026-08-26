#!/usr/bin/env coffee

> @3-/caller_line

test = =>
  throw Error()

do =>
  try
    test()
  catch
    console.log CallerLine()

