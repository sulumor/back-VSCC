import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/api.error";
import UsersDatamapper from "@/datamapper/users.datamapper";
import { User, Users } from "@/@Types/users.types";

export interface RequestWithUser extends Request {
  user?: string | jwt.JwtPayload;
}

function authenticateToken(req: RequestWithUser, _: any, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(
      new ApiError("Authentification nécessaire", { httpStatus: 401 })
    );
  const token = authHeader.split(" ")[1];

  if (!token) return next(new ApiError("Token invalide", { httpStatus: 401 }));

  if (!process.env.ACCESS_TOKEN_SECRET)
    return next(new ApiError("Manque clef du token", { httpStatus: 500 }));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) next(new ApiError(err.message, { httpStatus: 403 }));
    if (!user || typeof user === "string")
      return next(
        new ApiError("Authentification nécessaire", { httpStatus: 401 })
      );
    const userExits: User = await UsersDatamapper.findByPk(user.id);
    if (!userExits)
      return next(new ApiError("Accès interdit", { httpStatus: 403 }));
    req.user = user;
    next();
  });
}

function authenticateTokenWithoutExp(
  req: RequestWithUser,
  _: any,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(
      new ApiError("Authentification nécessaire", { httpStatus: 401 })
    );
  const token = authHeader.split(" ")[1];

  if (!token) return next(new ApiError("Token invalide", { httpStatus: 401 }));

  if (!process.env.ACCESS_TOKEN_SECRET)
    return next(new ApiError("Manque clef du token", { httpStatus: 500 }));

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { ignoreExpiration: true },
    async (err, user) => {
      if (err) next(new ApiError(err.message, { httpStatus: 403 }));
      if (!user || typeof user === "string")
        return next(
          new ApiError("Authentification nécessaire", { httpStatus: 401 })
        );
      const [userExits]: Users = await UsersDatamapper.findByParams({
        where: {
          id: user.id,
          firstname: user.firstname,
          is_admin: user.is_admin,
        },
      });
      if (!userExits)
        return next(new ApiError("Accès interdit", { httpStatus: 403 }));
      req.user = user;
      next();
    }
  );
}

function isAdmin(req: RequestWithUser, _: any, next: NextFunction) {
  if (!req.user || typeof req.user === "string")
    return next(
      new ApiError("Authentification nécessaire", { httpStatus: 401 })
    );
  if (!req.user.is_admin)
    return next(new ApiError("Accès refusé", { httpStatus: 403 }));
  return next();
}

export { authenticateToken, isAdmin, authenticateTokenWithoutExp };
