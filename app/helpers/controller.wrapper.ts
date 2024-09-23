import ApiError from "../errors/api.error";
import { Request, Response, NextFunction } from "express";

export default (
    controllerMdw: (req: Request, res: Response, next: NextFunction) => any
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerMdw(req, res, next);
    } catch (err: any) {
      next(new ApiError(err.message, { httpStatus: 500 }));
    }
  };
