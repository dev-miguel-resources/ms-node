import { Request, Response } from "express";
import { AuthApplication } from "../../application/auth.application";
import { AuthFactory } from "../../domain/auth.factory";
import { ITokens } from "../../domain/interfaces/tokens.interface";

export default class {
  constructor(private readonly app: AuthApplication) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.validateAccessToken = this.validateAccessToken.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    console.log("register", req.body);

    const auth = await AuthFactory.create(name, email, password);
    const authSaved = await this.app.register(auth);
    res.status(201).json(authSaved);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const tokens: ITokens | null = await this.app.login(email, password);
    res.json(tokens);
  }

  async validateAccessToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
      const payload = await this.app.validateAccessToken(token);
      res.json(payload);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  }

  async getNewAccessToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const tokens: ITokens | null = await this.app.getNewAccessToken(refreshToken);

    if (tokens) {
      res.json(tokens);
    } else {
      res.status(401).json("Unhatorized");
    }
  }
}
