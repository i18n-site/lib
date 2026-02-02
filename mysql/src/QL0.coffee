> ./Q.js

export default (
  sql
  arg...
) =>
  (
    await Q(
      sql
      arg
    )
  ).map ([i])=>i
