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
    const [existsUser]: Users = await UsersDatamapper.findByParams({
      where: { email },
    });
    if (!existsUser)
      return next(
        new ApiError(
          "Nous ne vous trouvons pas, notifier l'email avec lequel vous vous êtes enregistré(e)",
          { httpStatus: 404 }
        )
      );
    if (existsUser.is_resetting_password)
      return next(
        new ApiError(
          "Une demande de réinitialisation de mot de passe est déjà en cours.",
          { httpStatus: 409 }
        )
      );
    const resetToken = createId();

    const responseEmail = await resetPasswordEmail({
      user: existsUser,
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
      id: existsUser.id,
      is_resetting_password: true,
      reset_password_token: resetToken,
    });

    return res.status(204).end();
  }

  static async resetUserPassword(
    { body }: Request,
    res: Response,
    next: NextFunction
  ) {
    const { password, token, id } = body;
    const findingUser: User = await UsersDatamapper.findByPk(id);
    if (!findingUser)
      return next(
        new ApiError("Aucun utilisateur de trouvé", { httpStatus: 404 })
      );

    if (
      !findingUser.is_resetting_password ||
      findingUser.reset_password_token !== token
    )
      return next(
        new ApiError("Aucune demande de réinitialisation est en cours", {
          httpStatus: 404,
        })
      );

    await UsersDatamapper.update({
      id: findingUser.id,
      password: hashPassword(password),
      is_resetting_password: false,
      reset_password_token: null,
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

    const [user]: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (!user) return next(new ApiError(errorMessage, errorInfos));

    if (!comparePassword(body.password, user.password))
      return next(new ApiError(errorMessage, errorInfos));

    createRefreshTokenCookies(res, user);

    return res.status(200).json({ accessToken: createAccessToken(user) });
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
    const [existsUser]: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (existsUser)
      return next(new ApiError("Utilisateur existe déjà", { httpStatus: 400 }));

    body.password = hashPassword(body.password);

    const user: User = await UsersDatamapper.insert(body);

    createRefreshTokenCookies(res, user);

    return res.status(200).json({ accessToken: createAccessToken(user) });
  }
}
