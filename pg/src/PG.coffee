#!/usr/bin/env coffee

> ./conn.js
  ./genfunc.js
  ./pgConf.js

import { env } from 'node:process'

Q = conn ...pgConf(env)

export default Q

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

###
userIds = [1, 2, 3, 5, 8]

const users = await Q`
SELECT *
FROM users
WHERE id IN ${$LI(userIds)}
`;

console.log(users);
###
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
