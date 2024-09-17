-- Deploy VSCC:constraint to pg

BEGIN;

  ALTER TABLE "user"
    ADD CONSTRAINT "email_constraint" CHECK ("email" ~ '.+\@.+\..+'),
    ADD CONSTRAINT "password_constraint" CHECK ("password" ~ '(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$');

  ALTER TABLE "trace"
    ADD CONSTRAINT "stravaId_constraint" CHECK ("stravaId" ~ '^[\d]+$'),
    ADD CONSTRAINT "stravaHash_constraint" CHECK ("stravaHash" ~ '^\d\.[\d]{2}\/[\d]{2}\.[\d]{3}\/\d\.[\d]{3}$');

COMMIT;
