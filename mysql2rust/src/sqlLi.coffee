#!/usr/bin/env coffee

CREATE = /^CREATE (\w+) [`|"]?(\w+)[`|"]?/

DEFAULT_TIME = ' DEFAULT (unix_timestamp())'

< (sql)=>
  li = []

  sql = sql
    .replace(/ AUTO_INCREMENT\s?=[^;]+;/g, ";")
    .replace(/ DEFINER\s?=\s?`[^`]+`@`%` /g, " ")
    .replaceAll(" unsigned", " UNSIGNED")
    .replaceAll(" return ", " RETURN ")
    .replaceAll(" returns ", " RETURNS ")
    .replaceAll(
      " UNSIGNED NOT NULL DEFAULT '0'",
      " UNSIGNED NOT NULL DEFAULT 0",
    )
    .replaceAll(" DEFAULT CURRENT_TIMESTAMP", DEFAULT_TIME)
    .replaceAll(" DEFAULT current_timestamp()", DEFAULT_TIME)
    .replaceAll(" DEFAULT unix_timestamp()", DEFAULT_TIME)
    .replaceAll(/ BLOCK_SIZE \d+ LOCAL\b/g, " ")

  for t from [
    [/ varbinary\b/gi, ' VARBINARY']
    [/ varchar\b/gi, ' VARCHAR']
    [/ binary\b/gi, ' BINARY']

    [/ tinyint\b/gi, ' TINYINT']
    [/ smallint\b/gi, ' SMALLINT']
    [/ int\b/gi, ' INT']
    [/ mediumint\b/gi, ' MEDIUMINT']
    [/ bigint\b/gi,' BIGINT']

    [/ tinyint\(\d+\)/gi, ' TINYINT']
    [/ smallint\(\d+\)/gi, ' SMALLINT']
    [/ int\(\d+\)/gi, ' INT']
    [/ mediumint\(\d+\)/gi, ' MEDIUMINT']
    [/ bigint\(\d+\)/gi,' BIGINT']
    [/ null\b/gi,' NULL']
    [/ text\b/gi, ' TEXT']
    [/ blob\b/gi, ' BLOB']
    [/ longblob\b/gi, ' LONGBLOB']
    [/ longtext\b/gi, ' LONGTEXT']
    [/ mediumblob\b/gi, ' MEDIUMBLOB']
    [/ mediumtext\b/gi, ' MEDIUMTEXT']
    [/\s*,\s*/g,',']
  ]
    sql = sql.replace(...t)

  for i from sql.split('\n')
    i = i.trimEnd()
    len = i.length
    i = i.trimStart()
    indent = ''.padEnd(len-i.length)
    if not i
      continue

    if i.startsWith('/*!50003 CREATE*/')
      i = 'CREATE'+i.slice(i.lastIndexOf('/*!50003')+8).replace(' IF NOT EXISTS','')
      li.push i
      continue

    if i.startsWith('--')
      continue
    else if i.startsWith('/*')
      continue
    else if i.startsWith(') ENGINE=')
      i = ');'


    if i.endsWith ('*/;;')
      i = i.slice(0,-4)+';;'
    li.push indent+i

  r = []
  t = []

  + kind, name

  push = =>
    if t.length
      r.push [ kind, name, t.join('\n') ]
      t = []

  for i from li
    if (i == 'DELIMITER ;;') or i.startsWith('ALTER DATABASE ')
      continue

    m = i.match(CREATE)
    if m
      push()
      kind = m[1].toLowerCase()
      name = m[2]

    if i == 'DELIMITER ;'
      push()
      continue
    t.push i

  push()

  r
