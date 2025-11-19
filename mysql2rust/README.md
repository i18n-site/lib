# @3-/mysql2rust

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> path > join
  @3-/read
  ../lib/sqlLi.js


ROOT = import.meta.dirname

for table from [
  '3ti'
  'alive'
]
  console.log '→',table
  sql = read join ROOT, table+'.sql'
  for i from sqlLi(sql)
    console.log i
```

output :

```
→ 3ti
[
  'trigger',
  'watch_log',
  'CREATE TRIGGER `watch_log` AFTER UPDATE ON `watch` FOR EACH ROW BEGIN\n' +
    '   IF OLD.err = 0 AND NEW.err != 0 THEN\n' +
    '      INSERT INTO log (watch_id,state,ts) VALUES (NEW.id,1,UNIX_TIMESTAMP());\n' +
    '   ELSEIF OLD.err != 0 AND NEW.err = 0 THEN\n' +
    '      INSERT INTO log (watch_id,state,ts) VALUES (NEW.id,0,UNIX_TIMESTAMP());\n' +
    '   END IF;\n' +
    'END ;;'
]
[
  'function',
  'authArchId',
  'CREATE FUNCTION `authArchId`(v VARBINARY(255)) RETURNS INT UNSIGNED\n' +
    'BEGIN\n' +
    '  DECLARE r BIGINT UNSIGNED;\n' +
    '  SELECT id INTO r FROM authArch WHERE val=v;\n' +
    '  IF r IS NULL THEN\n' +
    '    INSERT INTO authArch (val) VALUES (v);\n' +
    '    RETURN LAST_INSERT_ID();\n' +
    'END IF;\n' +
    'RETURN r;\n' +
    'END ;;'
]
→ alive
[
  'table',
  'host',
  'CREATE TABLE `host` (\n' +
    '  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,`v` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `host_UN` (`v`)\n' +
    ');'
]
[
  'table',
  'kind',
  'CREATE TABLE `kind` (\n' +
    "  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,`v` VARCHAR(255) DEFAULT NULL,`duration` INT UNSIGNED NOT NULL DEFAULT '60',`warnErr` INT UNSIGNED DEFAULT NULL,`host_id` BIGINT UNSIGNED NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `kind_UN` (`v`)\n" +
    ');'
]
[
  'table',
  'log',
  'CREATE TABLE `log` (\n' +
    '  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,`watch_id` BIGINT UNSIGNED NOT NULL,`state` TINYINT UNSIGNED NOT NULL,`ts` BIGINT UNSIGNED NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `state_watch_id_IDX` (`watch_id`,`ts`)\n' +
    ');'
]
[
  'table',
  'url',
  'CREATE TABLE `url` (\n' +
    '  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,`v` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `url_UN` (`v`)\n' +
    ');'
]
[
  'table',
  'watch',
  'CREATE TABLE `watch` (\n' +
    '  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,`host_id` BIGINT UNSIGNED NOT NULL,`kind_id` BIGINT UNSIGNED NOT NULL,`dns_type` TINYINT UNSIGNED NOT NULL,`ts` BIGINT UNSIGNED NOT NULL DEFAULT 0,`err` INT UNSIGNED NOT NULL DEFAULT 0,`url_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,PRIMARY KEY (`id`),UNIQUE KEY `watch_UN` (`dns_type`,`kind_id`,`host_id`,`url_id`),KEY `watch_kind_IDX` (`kind_id`,`ts`)\n' +
    ');'
]
[
  'trigger',
  'watchLog',
  'CREATE TRIGGER `watchLog` AFTER UPDATE ON `watch` FOR EACH ROW BEGIN\n' +
    '   IF OLD.err = 0 AND NEW.err != 0 THEN\n' +
    '      INSERT INTO log (watch_id,state,ts) VALUES (NEW.id,1,UNIX_TIMESTAMP());\n' +
    '   ELSEIF OLD.err != 0 AND NEW.err = 0 THEN\n' +
    '      INSERT INTO log (watch_id,state,ts) VALUES (NEW.id,0,UNIX_TIMESTAMP());\n' +
    '   END IF;\n' +
    'END ;;'
]
[
  'trigger',
  'watchLog',
  'CREATE DEFINER="avnadmin"@"%" FUNCTION "hostId"(val VARBINARY(255)) RETURNS BIGINT UNSIGNED\n' +
    'BEGIN\n' +
    ' DECLARE id BIGINT UNSIGNED;\n' +
    ' SELECT host.id INTO id FROM host WHERE v=val;\n' +
    ' IF id IS NULL THEN\n' +
    '   INSERT INTO host (v) VALUES (val);\n' +
    '   SET id = LAST_INSERT_ID();\n' +
    ' END IF;\n' +
    ' RETURN id;\n' +
    'END ;;'
]
[
  'trigger',
  'watchLog',
  'CREATE DEFINER="avnadmin"@"%" FUNCTION "urlId"(val VARBINARY(255)) RETURNS BIGINT UNSIGNED\n' +
    'BEGIN\n' +
    ' DECLARE id BIGINT UNSIGNED;\n' +
    ' SELECT url.id INTO id FROM url WHERE v=val;\n' +
    ' IF id IS NULL THEN\n' +
    '   INSERT INTO url(v) VALUES (val);\n' +
    '   SET id = LAST_INSERT_ID();\n' +
    ' END IF;\n' +
    ' RETURN id;\n' +
    'END ;;'
]
```

## About

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。