import jwt from "jsonwebtoken";
import ApiError from "@/errors/api.error.js";
import { createId } from "@paralleldrive/cuid2";
import UsersDatamapper from "@/datamapper/users.datamapper";
// ----- HELPERS -----
import { createAccessToken } from "@/helpers/jwt.function";
import createRefreshTokenCookies from "@/helpers/cookies.function";
import { comparePassword, hashPassword } from "@/helpers/bcrypt.function";
import resetPasswordEmail from "@/helpers/nodemailer.function";
// ----- TYPES -----
import type { Users, User } from "@/@Types/users.types";
import { Request, Response, NextFunction } from "express";

export default class AuthController {
  static async forgotPassword(
    { body }: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email } = body;
    const existsUser: Users = await UsersDatamapper.findByParams({
      where: { email },
    });
    if (!existsUser[0])
      return next(
        new ApiError(
          "Nous ne vous trouvons pas, notifier l'email avec lequel vous vous êtes enregistré(e)",
          { httpStatus: 404 }
        )
      );
    if (existsUser[0].is_resetting_password)
      return next(
        new ApiError(
          "Une demande de réinitialisation de mot de passe est déjà en cours.",
          { httpStatus: 409 }
        )
      );
    const resetToken = createId();

    const responseEmail = await resetPasswordEmail({
      email,
      id: existsUser[0].id,
      token: resetToken,
    });

    if (!responseEmail) {
      return next(
        new ApiError(
          "Problème lors de l'envoi de l'email. Veuillez réessayer plus tard",
          { httpStatus: 503 }
        )
      );
    }

    await UsersDatamapper.update({
      id: existsUser[0].id,
      is_resetting_password: true,
      reset_password_token: resetToken,
    });

    return res.status(204).end();
  }

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
