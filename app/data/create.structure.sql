BEGIN;

DROP FUNCTION IF EXISTS
  "update_trace"(json),
  "add_trace"(json),
  "update_user"(json),
  "add_user"(json);

DROP TABLE IF EXISTS "trace", "user";

CREATE TABLE "trace" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" text NOT NULL,
  "strava_id" text NOT NULL UNIQUE,
  "strava_hash" text DEFAULT null,
  "start" text NOT NULL DEFAULT 'Clichy',
  "finish" text NOT NULL DEFAULT 'Clichy',
  "switch" text DEFAULT null,
  "is_a_loop" boolean NOT NULL DEFAULT false,
  "distance" int NOT NULL,
  "elevation" int NOT NULL,
  "description" text,
  "image" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

CREATE TABLE "user" (
  "id" uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY,
  "firstname" text NOT NULL,
  "password" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "is_admin" boolean NOT NULL DEFAULT false,
  "is_resetting_password" boolean NOT NULL DEFAULT false,
  "reset_password_token" text DEFAULT null,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

ALTER TABLE "user"
    ADD CONSTRAINT "email_constraint" CHECK ("email" ~ '.+\@.+\..+');

ALTER TABLE "trace"
  ADD CONSTRAINT "stravaId_constraint" CHECK ("strava_id" ~ '^[\d]+$'),
  ADD CONSTRAINT "stravaHash_constraint" CHECK ("strava_hash" ~ '^\d\.[\d]+\/[\d]{2}\.[\d]+\/\d\.[\d]+$');

CREATE FUNCTION "add_trace"(json) RETURNS "trace" AS $$
  INSERT INTO "trace" (title, strava_id, strava_hash, start, finish, switch, is_a_loop, distance, elevation, description,image) VALUES (
    ($1->>'title'),
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

  SELECT * FROM "trace" WHERE "id" = (SELECT "id" FROM "trace" ORDER BY "id" DESC LIMIT 1);

$$ LANGUAGE sql STRICT;

CREATE FUNCTION "update_trace"(json) RETURNS "trace" AS $$
  UPDATE "trace" SET
    "title" = COALESCE(($1->>'title'),"title"),
    "strava_id" = COALESCE(($1->>'strava_id'),"strava_id"),
    "strava_hash" = COALESCE(($1->>'strava_hash'), "strava_hash"),
    "start"= COALESCE(($1->>'start'),"start"),
    "finish" = COALESCE(($1->>'finish'),"finish"),
    "switch" = COALESCE($1->>'switch', "switch"),
    "is_a_loop" = COALESCE(($1->>'is_a_loop')::boolean, "is_a_loop"),
    "distance" = COALESCE(($1->>'distance')::int,"distance"),
    "elevation" = COALESCE(($1->>'elevation')::int,"elevation"),
    "description" = COALESCE($1->>'description', "description"),
    "image" = COALESCE(($1->>'image'), "image"),
    "updated_at" = now()
  WHERE "id" = (($1->>'id')::int);

  SELECT * FROM "trace" WHERE "id" = ($1->>'id')::int;

$$ LANGUAGE sql STRICT;

CREATE FUNCTION "add_user"(json) RETURNS "user" AS $$

  INSERT INTO "user" (firstname, email, password, is_admin) VALUES (
    $1->>'firstname',
    $1->>'email',
    $1->>'password',
    COALESCE(($1->>'is_admin')::boolean, false)
  );

  SELECT * FROM "user" WHERE "id" = (
    SELECT "id" FROM "user" ORDER BY "created_at" DESC LIMIT 1
  );

$$ LANGUAGE sql STRICT;

CREATE FUNCTION "update_user"(json) RETURNS "user" AS $$

  UPDATE "user" SET
    "firstname" = COALESCE(($1->>'firstname'), "firstname"),
    "email" = COALESCE(($1->>'email'), "email"),
    "password" = COALESCE(($1->>'password'), "password"),
    "is_admin" = COALESCE(($1->>'is_admin')::boolean, "is_admin"),
    "is_resetting_password" = COALESCE(($1->>'is_resetting_password')::boolean, "is_resetting_password"),
    "reset_password_token" = COALESCE(($1->>'reset_password_token'), "reset_password_token"),
    "updated_at" = now()
  WHERE "id"= (($1->>'id')::uuid);

  SELECT * FROM "user" WHERE "id" = ($1->>'id')::uuid; 

$$ LANGUAGE sql STRICT;

COMMIT;