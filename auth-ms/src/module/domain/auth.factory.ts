import { v4 as uuidv4 } from "uuid";

import { Auth } from "./auth";
import AuthAppService from "./services/auth.service";

export class AuthFactory {
  static patternEmail: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  static async create(name: string, email: string, password: string): Promise<Auth> {
    if (name.trim().length < 3) {
      throw new Error("Name must be at least 3 characters");
    }

    if (!email.match(AuthFactory.patternEmail)) {
      throw new Error("Invalid email address");
    }

    if (password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const id = uuidv4();
    const refreshToken = AuthAppService.generateRefreshToken();
    const passwordHash = await AuthAppService.cipherPassword(password);
    return new Auth(id, name, email, passwordHash, refreshToken);
  }
}
