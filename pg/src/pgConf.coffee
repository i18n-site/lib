> ./conn.js
  ./types.js

export UINT = [
  [20,"bigint"]
]

export default (env)=>
  [
    env.PG_URL
    {
      types: types(UINT)
      max: +env.PG_MAX or 1
    }
  ]

