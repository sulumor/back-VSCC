import bcrypt from "bcrypt";

export default class BcryptService {
  private salt;

  constructor() {
    this.salt = Number.parseInt(process.env.BCRYPT_SALT as string, 10);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.salt);
  }

  comparePassword(firstPassword: string, secondPassword: string): boolean {
    return bcrypt.compareSync(firstPassword, secondPassword);
  }
}
