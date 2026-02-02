#!/usr/bin/env coffee

> ./index.js > argId
  @3-/str2sec
  @3-/dbq > $e
  @3-/u8/U8.js

< (name_ip) =>
  li = []
  for [name,ip] from Object.entries name_ip
    # todo ipv6 to binary
    ip = '0x'+Buffer.from(
      U8(ip.split('.').map (i)=>Number.parseInt(i))
    ).toString('hex')
    li.push '(\''+name+'\','+ip+')'
  if li.length
    sql = "INSERT INTO ip(name,v)VALUES#{li.join(',')} ON DUPLICATE KEY UPDATE name=VALUES(name),v=VALUES(v)"
    await $e sql
  return
