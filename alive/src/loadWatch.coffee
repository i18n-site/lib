#!/usr/bin/env coffee

> ./index.js > argId
  @3-/dbq > $e $one $q
  @3-/utf8/utf8d.js

mapUtf8d = ([k,v])=>
  [utf8d(k),v]

IP = new Map(
  (
    await $q("SELECT name,id FROM ip")
  ).map mapUtf8d
)

HOST = new Map(
  (
    await $q("SELECT v,id FROM host")
  ).map mapUtf8d
)

insert = (kind_id, host, arg_id)=>
  if host.includes '.'
    host_id = HOST.get host
    type_li = [4,6]
  else
    host_id = IP.get host
    type_li = [0]
  for dns_type from type_li
    await $e(
      'INSERT INTO watch(kind_id,host_id,arg_id,dns_type)VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE id=id'
      kind_id, host_id, arg_id, dns_type
    )
  return

< (watch)=>
  for [kind, li] from Object.entries watch
    kind_id = await $one('SELECT id FROM kind WHERE v=?',kind)
    if Array.isArray li[0]
      for [host, arg_li] from li
        console.log host, arg_li
        for arg from arg_li
          arg_id = await argId arg
          await insert kind_id, host, arg_id
    else
      for host from li
        console.log host
        await insert kind_id, host, 0
  return
