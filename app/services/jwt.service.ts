import { User } from "@/@Types/users.types";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import ApiError from "../errors/api.error";
import UsersDatamapper from "../datamapper/users.datamapper";

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
      expiresIn: "14 days",
    });
  }

  haveNewAccessToken(refreshToken: string, res: Response, next: NextFunction) {
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
