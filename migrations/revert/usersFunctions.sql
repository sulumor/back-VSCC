-- Revert VSCC:usersFunctions from pg

BEGIN;

DROP FUNCTION 
  "update_user"(json),
  "add_user"(json);

COMMIT;
