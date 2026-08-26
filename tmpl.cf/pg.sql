CREATE SCHEMA IF NOT EXISTS state ;

CREATE TABLE IF NOT EXISTS state.heartbeat (
id bigserial NOT NULL,
name character varying(255) NOT NULL,
ts bigint NOT NULL,
ts_next bigint NOT NULL,
err text,
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE SCHEMA IF NOT EXISTS fn;

CREATE OR REPLACE FUNCTION fn.heartbeat(_name VARCHAR(255),_duration BIGINT,_err TEXT DEFAULT NULL)RETURNS VOID AS $$
DECLARE _ts BIGINT:=EXTRACT(EPOCH FROM NOW())::BIGINT;
BEGIN
UPDATE state.heartbeat SET ts=_ts,ts_next=_ts+_duration,err=_err WHERE name=_name;
IF NOT FOUND THEN INSERT INTO state.heartbeat(name,ts,ts_next,err)VALUES(_name,_ts,_ts+_duration,_err);END IF;
END;
$$ LANGUAGE plpgsql;

