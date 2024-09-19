import type { User } from "@/@Types/users.types";
import { Response } from "express";
import { createRefreshToken } from "./jwt.function";

export default function createRefreshTokenCookies(res: Response, datas: User) {
  // { httpOnly: true, sameSite: "none", secure: true }
  res.cookie("refresh_token", createRefreshToken(datas), {
    httpOnly: true,
    signed: true,
  });
}
