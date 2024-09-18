-- Revert VSCC:tracesFunctions from pg

BEGIN;

DROP FUNCTION 
  "update_trace"(json),
  "add_trace"(json);

COMMIT;
