-- Revert VSCC:init from pg

BEGIN;

DROP TABLE "trace", "user";

COMMIT;
