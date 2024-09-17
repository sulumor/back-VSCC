-- Deploy VSCC:constraint to pg

BEGIN;

  ALTER TABLE "user"
    ADD CONSTRAINT "email_constraint" CHECK ("email" ~ '.+\@.+\..+');

  ALTER TABLE "trace"
    ADD CONSTRAINT "stravaId_constraint" CHECK ("strava_id" ~ '^[\d]+$'),
    ADD CONSTRAINT "stravaHash_constraint" CHECK ("strava_hash" ~ '^\d\.[\d]+\/[\d]{2}\.[\d]+\/\d\.[\d]+$');

COMMIT;
