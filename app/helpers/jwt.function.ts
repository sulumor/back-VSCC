import { User } from "@/@Types/users.types";
import jwt from "jsonwebtoken";

function createAccessToken({ id, firstname, email, is_admin }: User) {
  if (!process.env.ACCESS_TOKEN_SECRET) return {};

  return jwt.sign(
    { id, firstname, email, is_admin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 20,
    }
  );
}

function createRefreshToken({ id, firstname, email, is_admin }: User) {
  if (!process.env.REFRESH_TOKEN_SECRET) return {};

  return jwt.sign(
    { id, firstname, email, is_admin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "14 days",
    }
  );
}

export { createAccessToken, createRefreshToken };
