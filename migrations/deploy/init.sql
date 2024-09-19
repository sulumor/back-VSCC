-- Deploy VSCC:init to pg

BEGIN;

CREATE TABLE "trace" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

COMMIT;
