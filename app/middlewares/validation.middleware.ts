import ApiError from "../errors/api.error.js";

export default (
    sourceProperty: string | number,
    schema: { validateAsync: (arg0: any) => any }
  ) =>
  async (
    req: { [x: string]: any },
    _: any,
    next: (arg0: ApiError | undefined) => void
  ) => {
    try {
      await schema.validateAsync(req[sourceProperty]);
      next(undefined);
    } catch (err: any) {
      next(new ApiError(err.details[0].message, { httpStatus: 400 }));
    }
  };
