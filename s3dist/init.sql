CREATE TABLE IF NOT EXISTS pub (
  id bigserial NOT NULL, site_id bigint NOT NULL, rel character varying(1024) NOT NULL, hash bytea NOT NULL, PRIMARY KEY (id), UNIQUE (site_id, rel)
);

CREATE OR REPLACE FUNCTION pub_rel_hash (_site_id bigint, _rel_li text[], _hash_li bytea[])
  RETURNS TABLE (
    rel text
  )
  AS $$
DECLARE
  i int;
BEGIN
  FOR i IN 1..ARRAY_LENGTH(_rel_li, 1)
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pub
      WHERE site_id = _site_id
        AND pub.rel = _rel_li[i]
        AND hash = _hash_li[i]) THEN
    rel := _rel_li[i];
    RETURN NEXT;
  END IF;
END LOOP;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pub_rel_hash_set (_site_id bigint, _rel_li text[], _hash_li bytea[])
  RETURNS void
  AS $$
DECLARE
  i integer;
BEGIN
  FOR i IN 1..ARRAY_UPPER(_rel_li, 1)
  LOOP
    INSERT INTO pub (site_id, rel, hash)
      VALUES (_site_id, _rel_li[i], _hash_li[i])
    ON CONFLICT (site_id, rel)
      DO UPDATE SET hash = EXCLUDED.hash;
  END LOOP;
END;
$$
LANGUAGE plpgsql;

