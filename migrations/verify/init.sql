-- Verify VSCC:init on pg

BEGIN;

SELECT * FROM "trace" WHERE false;
SELECT * FROM "user" WHERE false;

ROLLBACK;
