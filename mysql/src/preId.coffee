> ./E00.js
  ./E.js
  @3-/retry

export default (key) =>
  [
    # now id
    (
      await E00(
        'SELECT u64 FROM kU64 WHERE k=?'
        key
      )
    ) or 0

    # save
    retry (last_id)=>
      await E(
        'INSERT INTO kU64 (k,u64) VALUES (?,?) ON DUPLICATE KEY UPDATE u64=VALUES(u64)'
        key
        last_id
      )
      return
  ]
