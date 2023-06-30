import { Result } from "neverthrow";
import { IError } from "../../../core/exceptions/error.exception";
import { Payment } from "../payment";

export type PaymentResult = Result<Payment, IError>