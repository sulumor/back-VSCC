import { User } from "@/@Types/users.types";
import { Response } from "express";
import JWTService from "./jwt.service";

export default class CookiesService {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
  }

  createRefreshTokenCookies(res: Response, datas: User) {
    // { httpOnly: true, sameSite: "none", secure: true }
    res.cookie("refresh_token", this.jwtService.createRefreshToken(datas), {
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });
  }
}
