> ./CONN.js

export default (
  sql
  arg...
) =>
  (
    await CONN.query(
      sql
      arg
    )
  )[0]
