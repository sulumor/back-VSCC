import { User } from "@/@Types/users.types";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import ApiError from "../errors/api.error";
import UsersDatamapper from "../datamapper/users.datamapper";
import { IncomingHttpHeaders } from "http";

export default class JWTService {
  private accessSecretToken: string;
  private refreshSecretToken: string;

  constructor() {
    this.accessSecretToken = process.env.ACCESS_TOKEN_SECRET || "accessToken";
    this.refreshSecretToken =
      process.env.REFRESH_TOKEN_SECRET || "refreshToken";
  }

  createAccessToken({ id, firstname, email, is_admin }: User) {
    return jwt.sign(
      { id, firstname, email, is_admin },
      this.accessSecretToken,
      {
        expiresIn: 20,
      }
    );
  }

  createRefreshToken({ id }: User) {
    return jwt.sign({ id }, this.refreshSecretToken, {
      expiresIn: "1 days",
    });
  }

  haveNewAccessToken(
    { authorization }: IncomingHttpHeaders,
    res: Response,
    next: NextFunction
  ) {
    if (!authorization)
      return next(
        new ApiError("Authentification nécessaire", { httpStatus: 401 })
      );
    const refreshToken = authorization.split(" ")[1];

    if (!refreshToken)
      return next(new ApiError("Token invalide", { httpStatus: 401 }));

    if (!process.env.REFRESH_TOKEN_SECRET)
      return next(new ApiError("Manque clef du token", { httpStatus: 500 }));
    jwt.verify(refreshToken, this.refreshSecretToken, async (err, payload) => {
      if (err) return next(new ApiError(err.message, { httpStatus: 403 }));
      if (!payload || typeof payload === "string")
        return next(
          new ApiError("Une erreur est survenu. Veuillez réessayer", {
            httpStatus: 404,
          })
        );
      const user: User = await UsersDatamapper.findByPk(payload.id);

      if (!user)
        return next(
          new ApiError("Aucun utilisateur de trouvé", { httpStatus: 404 })
        );
      return res.status(200).json({
        accessToken: this.createAccessToken(user),
      });
    });
  }
}
