import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../errors/api.error.js";
import CoreDatamapper from "../datamapper/core.datamapper";
import createJWT from "../helpers/jwt.function";

export default class AuthController {
  static async login(
    { body }: any,
    res: {
      cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean }) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    },
    next: (arg0: ApiError) => any
  ) {
    const errorMessage = "Authentification failed";
    const errorInfos = { httpStatus: 401 };

    const [user] = await CoreDatamapper.findByParams({
      where: { email: body.email },
    });
    if (!user) return next(new ApiError(errorMessage, errorInfos));

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password
    );
    if (!isPasswordCorrect) return next(new ApiError(errorMessage, errorInfos));

    const token = createJWT(user);
    res.cookie("refresh_token", token.refreshToken, { httpOnly: true });

    return res.status(200).json(token);
  }

  // eslint-disable-next-line consistent-return
  static refreshToken(
    { cookies }: any,
    res: {
      cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean }) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    },
    next: (arg0: ApiError) => void
  ) {
    const refreshToken = cookies.refresh_token;
    if (!refreshToken)
      return next(new ApiError("Null refresh token", { httpStatus: 401 }));
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err: { message: string | undefined }, user: any) => {
        if (err) next(new ApiError(err.message, { httpStatus: 403 }));
        const token = createJWT(user);
        // { httpOnly: true, sameSite: "none", secure: true }
        res.cookie("refresh_token", token.refreshToken, { httpOnly: true });

        return res.status(200).json(token);
      }
    );
  }

  static deleteToken(
    _: any,
    res: {
      clearCookie: (arg0: string) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { message: string }): any; new (): any };
      };
    }
  ) {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  }
}
