import jwt from "jsonwebtoken";

function createJWT({ id, name, email }: any) {
  const user = { id, name, email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 20,
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "14 days",
  });
  return { accessToken, refreshToken };
}

export default createJWT;
