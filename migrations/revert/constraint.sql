-- Revert VSCC:constraint from pg

BEGIN;

ALTER TABLE "user"
  DROP CONSTRAINT "email_constraint";

ALTER TABLE "trace"
  DROP CONSTRAINT "stravaId_constraint", 
  DROP CONSTRAINT "stravaHash_constraint";

COMMIT;
