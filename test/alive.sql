
CREATE TABLE "watch" (
  "id" bigint unsigned NOT NULL AUTO_INCREMENT,
  "host_id" bigint unsigned NOT NULL,
  "kind_id" bigint unsigned NOT NULL,
  "dns_type" tinyint unsigned NOT NULL,
  "ts" bigint unsigned NOT NULL,
  "fail" int unsigned NOT NULL DEFAULT '0',
  "kind_url_id" bigint unsigned NOT NULL DEFAULT '0',
  "host_url_id" bigint unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "watch_UN" ("kind_url_id","host_url_id"),
  KEY "watch_kind_IDX" ("kind_id","ts")
);
