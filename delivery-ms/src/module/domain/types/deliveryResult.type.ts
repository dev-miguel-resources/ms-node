import { Result } from "neverthrow";
import { IError } from "../../../core/exceptions/error.exception";
import { Delivery } from "../delivery";

export type DeliveryResult = Result<Delivery, IError>