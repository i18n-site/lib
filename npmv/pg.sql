CREATE schema cdn;

CREATE TABLE cdn.pkg (
id bigserial NOT NULL,
name character varying(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE TABLE cdn.refresh
(
id bigserial NOT NULL,
pkg_id bigint NOT NULL,
uid bigint NOT NULL,
ts BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
PRIMARY KEY (id)
);

CREATE INDEX idx_cdn_refresh_ts ON cdn.refresh (ts);

CREATE TABLE cdn.vps (
id bigserial NOT NULL,
name character varying(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE TABLE cdn.vps_refresh (
id bigserial NOT NULL,
refresh_id bigint NOT NULL,
ts bigint NOT NULL,
PRIMARY KEY (id)
);


CREATE OR REPLACE FUNCTION cdn.vps_not_refresh()
RETURNS TABLE(name character varying, ts bigint) AS $$
DECLARE
  last_ts bigint;
BEGIN
  SELECT r.ts INTO last_ts FROM cdn.refresh r WHERE r.ts < EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 60 ORDER BY r.ts DESC LIMIT 1;
  IF last_ts IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY SELECT v.name, vr.ts FROM cdn.vps_refresh vr JOIN cdn.vps v ON vr.id=v.id WHERE vr.ts<last_ts;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cdn.refresh_pkg(uid bigint, pkg_name character varying(255))
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  last_id bigint;
  pkg_id bigint;
BEGIN
  SELECT id INTO pkg_id FROM cdn.pkg WHERE name=pkg_name;
  IF NOT FOUND THEN
    INSERT INTO cdn.pkg(name) VALUES (pkg_name) RETURNING id INTO pkg_id;
  END IF;
  INSERT INTO cdn.refresh(pkg_id, uid) VALUES (pkg_id, uid) RETURNING id INTO last_id;
  PERFORM pg_notify(CAST('refresh_pkg' AS text), last_id::text);
END;
$$;

