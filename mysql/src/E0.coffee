> ./CONN.js

export default (
  sql
  arg...
) =>
  r = (
    await CONN.execute(
      sql
      arg
    )
  )[0]
  return r[0]

