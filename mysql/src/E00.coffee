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
  if r.length
    return r[0]?[0]
  return

