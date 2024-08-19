#!/usr/bin/env coffee

> @3-/dbq > $q $one

run = (li)=>
  for i from li
    await $q i
  return

export default =>
  if not await $one('SHOW TABLES LIKE "v"')
    ver = await $one('SELECT VERSION()')
    console.log ver
    if ver.includes('-TiDB-')
      create_opt = ' AUTO_ID_CACHE=1'

    sql_li = """
CREATE table `site` (`id` bigint unsigned not null auto_increment primary key, `name` varbinary(255) not null, `uid` bigint unsigned not null, UNIQUE(name));
CREATE table `siteV` (`id` bigint unsigned not null auto_increment primary key, `ts` bigint unsigned not null, `siteId` bigint unsigned not null, `channel` varbinary(255) not null, `v` varbinary(255) not null, `distId` bigint unsigned not null,  CONSTRAINT siteV_siteId_channel_v UNIQUE (`siteId`, `channel`, `v`));
CREATE table `dist` (`id` bigint unsigned not null auto_increment primary key, `uploaded` boolean not null default '0', `hash` binary(32) not null, `name` text not null, `siteId` bigint unsigned not null default '0', UNIQUE(hash));
CREATE table `pub` (`id` bigint unsigned not null auto_increment primary key, `name` varbinary(255) not null, `hash` binary(32) not null, UNIQUE(name));
CREATE table `v` (`id` bigint unsigned not null auto_increment primary key, `ts` bigint unsigned not null, `hash` binary(32) not null, `css` bigint unsigned not null, `js` bigint unsigned not null, `idLi` varbinary(65400) not null, UNIQUE(hash));
""".split(';')

    ing = []
    t = []
    for i in sql_li
      i = i.trim()
      if i
        is_create = i.startsWith 'CREATE'
        if create_opt and is_create
          ing.push run(t)
          t = []
          i += create_opt
        t.push i
    ing.push run(t)
    await Promise.all ing
  return
