#!/usr/bin/env coffee

> ./conn.js
  ./genfunc.js
  ./PG_ENV.js

< Q = conn ...PG_ENV

FUNC = genfunc Q

{
  UNSAFE
  RAW
  LI
  LI0
  ONE
  ONE0
  EXE
  UPSERT
  ITER
} = FUNC

export $LI = Q.array
export UNSAFE = UNSAFE
export RAW = RAW
export LI = LI
export LI0 = LI0
export ONE = ONE
export ONE0 = ONE0
export EXE = EXE
export UPSERT = UPSERT
export ITER = ITER
