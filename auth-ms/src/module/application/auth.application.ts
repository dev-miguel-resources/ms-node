import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Auth } from "../domain/auth";
import { AuthRepository } from "../domain/repositories/auth.repository";
import { ITokens } from "../domain/interfaces/tokens.interface";
import AuthAppService from "../domain/services/auth.service";

export class AuthApplication {
  private repositoryAuth: AuthRepository;

  constructor(repositoryAuth: AuthRepository) {
    this.repositoryAuth = repositoryAuth;
  }

  async register(auth: Auth): Promise<Auth> {
    const authResult = await this.repositoryAuth.register(auth);
    if (authResult.isErr()) {
      throw new InternalServerErrorException(authResult.error.message);
    }

    return authResult.value;
  }

  async login(email: string, password: string): Promise<ITokens | null> {
    const auth = await this.repositoryAuth.findOne({ email });
    if (auth) {
      const isMatchPassword = await AuthAppService.isMatchPassword(password, auth.password);

      if (isMatchPassword) {
        const tokens: ITokens = {
          accessToken: AuthAppService.generateAccessToken(auth.id, auth.name),
          refreshToken: auth.refreshToken
        };
        return tokens;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async validateAccessToken(token: string) {
    return AuthAppService.validateAccessToken(token)
  }
}
