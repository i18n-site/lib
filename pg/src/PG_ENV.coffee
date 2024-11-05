> ./conn.js
  ./types.js

{env} = process

{PG_URL} = env

export UINT = [
  [20,"bigint"]
]

export default [
  PG_URL
  {
    types: types(UINT)
    max: +env.PG_MAX or 1
  }
]

