import { err, ok } from "neverthrow";

import Model from "./models/auth.model";
import { Auth } from "../domain/auth";
import { IError } from "../../core/exceptions/error.exception";
import { AuthRepository } from "../domain/repositories/auth.repository";
import { AuthResult } from "../domain/types/auth.type";

export class AuthInfraestructure implements AuthRepository {
  async register(auth: Auth): Promise<AuthResult> {
    try {
      await Model.create(auth);
      return ok(auth);
    } catch (error) {
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      return err(resultErr);
    }
  }
}
