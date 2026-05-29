CREATE TABLE IF NOT EXISTS `txt` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
`hash` binary(32) NOT NULL,
`val` longtext DEFAULT NULL,
PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
UNIQUE KEY `hash` (`hash`)
);