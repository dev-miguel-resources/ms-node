import { Result } from "neverthrow";
import { Auth } from "../auth";
import { IError } from "../../../core/exceptions/error.exception";

export type AuthResult = Result<Auth, IError>;