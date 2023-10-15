import { Request, Response } from "express";
import { AuthApplication } from "../../application/auth.application";
import { AuthFactory } from "../../domain/auth.factory";

export default class {
  constructor(private readonly app: AuthApplication) {
    this.register = this.register.bind(this);
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    console.log("register", req.body);

    const auth = await AuthFactory.create(name, email, password);
    const authSaved = await this.app.register(auth);
    res.status(201).json(authSaved);
  }
}
