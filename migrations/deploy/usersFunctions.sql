-- Deploy VSCC:usersFunctions to pg

BEGIN;

CREATE FUNCTION "add_user"(json) RETURNS "user" AS $$

  INSERT INTO "user" (firstname, email, password, is_admin) VALUES (
    $1->>'firstname',
    $1->>'email',
    $1->>'password',
    COALESCE(($1->>'is_admin')::boolean, false)
  );

  SELECT * FROM "user" WHERE "id" = (
    SELECT "id" FROM "user" ORDER BY "id" DESC LIMIT 1
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
