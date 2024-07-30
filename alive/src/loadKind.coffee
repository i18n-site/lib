#!/usr/bin/env coffee

> ./index.js > argId
  @3-/str2sec
  @3-/dbq > $e

< (kind) =>
  for [kind,o] from Object.entries kind
    console.log kind, o
    duration = str2sec o.duration
    {arg, warnErr} = o
    arg_id = if arg then await argId(arg) else 0
    await $e(
      "INSERT INTO kind(v,arg_id,duration,warnErr)VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE arg_id=VALUES(arg_id),warnErr=VALUES(warnErr),duration=VALUES(duration)",
      kind,arg_id,duration,(+warnErr or 0)
    )
  return
