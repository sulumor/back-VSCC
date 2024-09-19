import { User } from "@/@Types/users.types";
import jwt from "jsonwebtoken";

function createJWT({ id, firstname, email, is_admin }: User) {
  const user = { id, firstname, email, is_admin };
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET)
    return {};

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 20,
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "14 days",
  });
  return { accessToken, refreshToken };
}

export default createJWT;
