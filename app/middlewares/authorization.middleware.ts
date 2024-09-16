import jwt from "jsonwebtoken";
import ApiError from "../errors/api.error";

export default function authenticateToken(
  req: { headers: { authorization: any }; user: any },
  _: any,
  next: (arg0: ApiError | undefined) => void
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) next(new ApiError("Null token", { httpStatus: 401 }));
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: { message: string | undefined }, user: any) => {
      if (err) next(new ApiError(err.message, { httpStatus: 403 }));
      req.user = user;
      next(undefined);
    }
  );
}
