DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `watch_log` AFTER UPDATE ON `watch` FOR EACH ROW BEGIN
   IF OLD.err = 0 AND NEW.err != 0 THEN
      INSERT INTO log (watch_id, state, ts) VALUES (NEW.id, 1, UNIX_TIMESTAMP());
   ELSEIF OLD.err != 0 AND NEW.err = 0 THEN
      INSERT INTO log (watch_id, state, ts) VALUES (NEW.id, 0, UNIX_TIMESTAMP());
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'alive'
--

--
-- Dumping routines for database 'alive'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_TRANS_TABLES,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;



DELIMITER ;;
CREATE DEFINER=`i`@`%` FUNCTION `authArchId`(v VARBINARY(255)) RETURNS int(10) unsigned
BEGIN
  DECLARE r BIGINT UNSIGNED;
  SELECT id INTO r FROM authArch WHERE val=v;
  IF r IS NULL THEN
    INSERT INTO authArch (val) VALUES (v);
    RETURN LAST_INSERT_ID();
END IF;
RETURN r;
END ;;
DELIMITER ;
