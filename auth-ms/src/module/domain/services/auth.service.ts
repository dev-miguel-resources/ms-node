import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export default class AuthAppService {
  static generateAccessToken(id: string, name: string): string {
    const payload = {
      id,
      name,
      iat: moment().unix(),
      exp: moment()
        .add(process.env.JWT_EXPIRES || 120, "seconds")
        .unix()
    };

    return jwt.encode(payload, process.env.JWT_SECRET || "secret");
  }

  static generateRefreshToken(): string {
    return uuidv4();
  }

  static validateAccessToken(token: string) {
    // pendiente
  }

  static async cipherPassword(password: string): Promise<string> {
    return "";
    // pendiente
  }

  static async isMatchPassword(password: string, passwordHash: string): Promise<boolean> {
    return false;
    // pendiente
  }
}
