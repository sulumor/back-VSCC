import ApiError from "@/errors/api.error.js";
import { createId } from "@paralleldrive/cuid2";
import UsersDatamapper from "@/datamapper/users.datamapper";
// ----- TYPES -----
import type { Users, User } from "@/@Types/users.types";
import { Request, Response, NextFunction } from "express";
// ----- SERVICES -----
import MailerService from "@/services/mailer.service";
import BcryptService from "@/services/bcrypt.service";
import CookiesService from "@/services/cookies.service";
import JWTService from "@/services/jwt.service";

export default class AuthController {
  private static mailerService: MailerService = new MailerService();
  private static bcryptService: BcryptService = new BcryptService();
  private static cookiesService: CookiesService = new CookiesService();
  private static jwtService: JWTService = new JWTService();

  static async forgotPassword(
    { body }: Partial<Request>,
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

    const responseEmail: boolean = await this.mailerService.resetPasswordEmail({
      user: existsUser,
      token: resetToken,
    });

    if (!responseEmail)
      return next(
        new ApiError(
          "Problème lors de l'envoi de l'email. Veuillez réessayer plus tard",
          { httpStatus: 503 }
        )
      );

    await UsersDatamapper.update({
      id: existsUser.id,
      is_resetting_password: true,
      reset_password_token: resetToken,
    });

    return res.status(204).end();
  }

  static async resetUserPassword(
    { body }: Partial<Request>,
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
      password: this.bcryptService.hashPassword(password),
      is_resetting_password: false,
      reset_password_token: null,
    });

    return res.status(204).end();
  }

  static async login(
    { body }: Partial<Request>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errorMessage = "Échec lors de l'authentification";
    const errorInfos = { httpStatus: 401 };

    const [user]: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (!user) return next(new ApiError(errorMessage, errorInfos));

    if (!this.bcryptService.comparePassword(body.password, user.password))
      return next(new ApiError(errorMessage, errorInfos));

    this.cookiesService.createRefreshTokenCookies(res, user);

    return res
      .status(200)
      .json({ accessToken: this.jwtService.createAccessToken(user) });
  }

  static refreshToken(
    { signedCookies }: Partial<Request>,
    res: Response,
    next: NextFunction
  ) {
    if (!signedCookies || !signedCookies.refresh_token)
      return next(
        new ApiError(
          "Veuillez vous connecter pour poursuivre la visite de notre site",
          { httpStatus: 404 }
        )
      );

    this.jwtService.haveNewAccessToken(signedCookies.refresh_token, res, next);
  }

  static deleteToken(_: any, res: Response) {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Le refresh token bien supprimé" });
  }

  static async register(
    { body }: Partial<Request>,
    res: Response,
    next: NextFunction
  ) {
    const [existsUser]: Users = await UsersDatamapper.findByParams({
      where: { email: body.email },
    });

    if (existsUser)
      return next(new ApiError("Utilisateur existe déjà", { httpStatus: 400 }));

    body.password = this.bcryptService.hashPassword(body.password);

    const user: User = await UsersDatamapper.insert(body);

    this.cookiesService.createRefreshTokenCookies(res, user);

    return res
      .status(200)
      .json({ accessToken: this.jwtService.createAccessToken(user) });
  }
}
