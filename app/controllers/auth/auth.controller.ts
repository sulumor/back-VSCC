import jwt from "jsonwebtoken";
import ApiError from "@/errors/api.error.js";
import { createAccessToken } from "@/helpers/jwt.function";
import UsersDatamapper from "@/datamapper/users.datamapper";
import type { Users, User } from "@/@Types/users.types";
import { Request, Response, NextFunction } from "express";
import createRefreshTokenCookies from "@/helpers/cookies.function";
import { comparePassword, hashPassword } from "@/helpers/bcrypt.function";

export default class AuthController {
  static async login(
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errorMessage = "Échec lors de l'authentification";
    const errorInfos = { httpStatus: 401 };

    const user: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (!user[0]) return next(new ApiError(errorMessage, errorInfos));

    if (!comparePassword(body.password, user[0].password))
      return next(new ApiError(errorMessage, errorInfos));

    createRefreshTokenCookies(res, user[0]);

    return res.status(200).json({ accessToken: createAccessToken(user[0]) });
  }

  // eslint-disable-next-line consistent-return
  static refreshToken(
    { signedCookies }: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken: string = signedCookies.refresh_token;

    if (!refreshToken)
      return next(new ApiError("Refresh token est null", { httpStatus: 401 }));

    if (!process.env.REFRESH_TOKEN_SECRET)
      return next(new ApiError("Manque clef du token", { httpStatus: 500 }));

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) next(new ApiError(err.message, { httpStatus: 403 }));

      return res
        .status(200)
        .json({ accessToken: createAccessToken(user as User) });
    });
  }

  static deleteToken(_: any, res: Response) {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Le refresh token bien supprimé" });
  }

  static async register({ body }: Request, res: Response, next: NextFunction) {
    const existsUser: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (existsUser[0])
      return next(new ApiError("Utilisateur existe déjà", { httpStatus: 400 }));

    body.password = hashPassword(body.password);

    const user: User = await UsersDatamapper.insert(body);

    createRefreshTokenCookies(res, user);

    return res.status(200).json({ accessToken: createAccessToken(user) });
  }
}
