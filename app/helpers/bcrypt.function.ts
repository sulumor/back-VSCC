import bcrypt from "bcrypt";

function hashPassword(password: string): string {
  return bcrypt.hashSync(
    password,
    Number.parseInt(process.env.BCRYPT_SALT as string, 10)
  );
}

function comparePassword(
  firstPassword: string,
  secondPassword: string
): boolean {
  return bcrypt.compareSync(firstPassword, secondPassword);
}

export { hashPassword, comparePassword };
