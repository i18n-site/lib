> @3-/dbq > $q $e

< (table, hash_name)=>
  id_name = new Map
  to_upload = []

  while hash_name.size
    keys = hash_name.keys()
    exist = await $q(
      "SELECT id,hash,uploaded FROM #{table} WHERE hash IN (?#{
        ''.padEnd(keys.length*2-4,',?')
      })"
      ...keys
    )

    for [id,hash,uploaded] in exist
      name = hash_name.get(hash)
      if name
        id_name.set id,name
        hash_name.delete hash
        if not uploaded
          to_upload.push id

    if hash_name.size
      qli = []
      to_insert = []

      hash_name.entries().forEach ([hash,name])=>
        hash = Buffer.from hash
        qli.push '(?,?)'
        to_insert.push(
          hash
          name
        )
        return

      await $e(
        "INSERT INTO #{table} (hash,name) VALUES #{qli.join(',')} ON DUPLICATE KEY UPDATE name=VALUES(name)"
        ...to_insert
      )

  [id_name, to_upload]
