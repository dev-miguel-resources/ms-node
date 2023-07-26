import { Result } from "neverthrow";
import { IError } from "../../../core/exceptions/error.exception";
import { Store } from "../store";

export type StoreResult = Result<Store, IError>