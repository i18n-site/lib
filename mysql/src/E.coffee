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
  )
  # console.log r[1]
  r[0]
