-- Revert VSCC:constraint from pg

BEGIN;

ALTER TABLE "user"
  DROP CONSTRAINT "email_constraint", "password_constraint";

ALTER TABLE "trace"
  DROP CONSTRAINT "stravaId_constraint", "stravaHash_constraint";

COMMIT;
