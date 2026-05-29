#!/usr/bin/env coffee
> zx/globals:
  path > join
  @3-/mysql2rust/sqlLi.js
  @3-/mysql2rust/rm.js > rmPre
  @3-/mysql2rust/rust.js
  @3-/mysql2rust/gener.js
  @3-/write
  yargs

{
  argv
} = yargs(process.argv.slice(2))
  .alias('r', 'rust')
  .describe('rust','rust file output path').help()

E = process.env

{
  stdout
} = await $"mysqldump -h#{E.MYSQL_HOST} -P#{E.MYSQL_PORT} -u#{E.MYSQL_USER} #{E.MYSQL_DB} --skip-set-charset --set-gtid-purged=OFF --events --column-statistics=0 --no-data --skip-add-drop-table --routines"

li = sqlLi stdout

OUTDIR = E.MYSQL_DUMP or join(process.cwd(),'dump')
rmPre OUTDIR

for [kind, name, sql] from li
  write(
    join OUTDIR, kind, name+'.sql'
    sql
  )

if argv.rust
  [GEN, gen] = gener()
  li.map (i)=>gen ...i
  write(
    argv.rust
    rust GEN
  )
