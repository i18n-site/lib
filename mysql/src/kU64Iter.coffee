> ./preId.js
  ./E.js


export default new Proxy(
  {}
  get:(_, key)=>
    (
      sql,run
      option = {}
    )=>
      limit = option.limit or 200
      split = option.split or 10

      pos = sql.indexOf(',')
      if pos < 0
        pos = sql.indexOf(' ')

      idkey = sql.slice(0,pos)

      if sql.includes('WHERE')
        sql += ' AND '
      else
        sql += ' WHERE '

      sql = 'SELECT ' + sql + idkey + '>? ORDER BY '+idkey+' LIMIT '+limit

      [
        pre_id
        savePreId
      ] = await preId key

      li = []
      `out: //`
      loop
        r = await E(
          sql
          pre_id
        )
        # if not li.length
        #   break

        li = li.concat r
        len = li.length
        rlen = r.length

        if len
          pre_id = li.at(-1)[0]

          loop
            if len < split and rlen == limit
              continue out
            if len <= 0
              break
            len -= split
            t = li.splice(0, split)
            await run t
            await savePreId(
              t.at(-1)[0]
            )

        if rlen < limit
          break
      return
)
