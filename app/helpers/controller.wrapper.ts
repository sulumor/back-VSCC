import ApiError from "../errors/api.error";

export default (controllerMdw: (arg0: any, arg1: any, arg2: any) => any) =>
  async (req: any, res: any, next: (arg0: any) => void) => {
    try {
      await controllerMdw(req, res, next);
    } catch (err: any) {
      next(new ApiError(err.message, { httpStatus: 500 }));
    }
  };
