import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "@/errors/api.error.js";
import createJWT from "@/helpers/jwt.function";
import UsersDatamapper from "@/datamapper/users.datamapper";
import type { Users, User } from "@/@Types/users.types";
import { Request, Response, NextFunction } from "express";

export default class AuthController {
  static async login(
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errorMessage = "Échec de l'authentification";
    const errorInfos = { httpStatus: 401 };

    const user: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (!user[0]) return next(new ApiError(errorMessage, errorInfos));

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user[0].password
    );

    if (!isPasswordCorrect) return next(new ApiError(errorMessage, errorInfos));

    const token = createJWT(user[0]);

    res.cookie("refresh_token", token.refreshToken, { httpOnly: true });

    return res.status(200).json(token);
  }

  // eslint-disable-next-line consistent-return
  static refreshToken({ cookies }: Request, res: Response, next: NextFunction) {
    const refreshToken: string = cookies.refresh_token;

    if (!refreshToken)
      return next(new ApiError("Refresh token est null", { httpStatus: 401 }));

    if (!process.env.REFRESH_TOKEN_SECRET)
      return next(new ApiError("Manque clef du token", { httpStatus: 500 }));

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) next(new ApiError(err.message, { httpStatus: 403 }));
      const token = createJWT(user as User);
      // { httpOnly: true, sameSite: "none", secure: true }
      res.cookie("refresh_token", token.refreshToken, { httpOnly: true });

      return res.status(200).json(token);
    });
  }

  static deleteToken(_: any, res: Response) {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  }
}
