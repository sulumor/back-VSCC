-- Deploy VSCC:tracesFunctions to pg

BEGIN;

CREATE VIEW trace_view AS
  SELECT
    "id", 
    "strava_id",
    "strava_hash",
    "start",
    "finish",
    "switch",
    "is_a_loop",
    "distance",
    "elevation",
    "description",
    "image"
  FROM "trace";

CREATE FUNCTION "add_trace"(json) RETURNS "trace_view" AS $$
  INSERT INTO "trace"(strava_id, strava_hash, start, finish, switch, is_a_loop, distance, elevation, description,image) VALUES (
    ($1->>'strava_id'),
    ($1->>'strava_hash'),
    ($1->>'start'),
    ($1->>'finish'),
    COALESCE($1->>'switch', NULL),
    COALESCE(($1->>'is_a_loop')::boolean, false),
    ($1->>'distance')::int,
    ($1->>'elevation')::int,
    COALESCE($1->>'description', NULL),
    ($1->>'image')
  );

  SELECT * FROM "trace_view" WHERE "id" = (SELECT "id" FROM "trace" ORDER BY "id" DESC LIMIT 1);

$$ LANGUAGE sql STRICT;

CREATE FUNCTION "update_trace"(json) RETURNS "trace_view" AS $$
  UPDATE "trace" SET
    "strava_id" = COALESCE(($1->>'strava_id'),"strava_id"),
   "strava_hash" = COALESCE(($1->>'strava_hash'), "strava_hash"),
    "start"= COALESCE(($1->>'start'),"start"),
    "finish" = COALESCE(($1->>'finish'),"finish"),
    "switch" = COALESCE($1->>'switch', "switch"),
    "is_a_loop" = COALESCE(($1->>'is_a_loop')::boolean, "is_a_loop"),
    "distance" = COALESCE(($1->>'distance')::int,"distance"),
    "elevation" = COALESCE(($1->>'elevation')::int,"elevation"),
    "description" = COALESCE($1->>'description', "description"),
    "image" = COALESCE(($1->>'image'), "image")
  WHERE "id" = (($1->>'id')::int);

  SELECT * FROM "trace_view" WHERE "id" = ($1->>'id')::int;

$$ LANGUAGE sql STRICT;

COMMIT;
