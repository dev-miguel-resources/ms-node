import { err, ok } from "neverthrow";
import { IError } from "../../core/exceptions/error.exception";
import { Payment } from "../domain/payment";
import { PaymentRepository } from "../domain/repositories/payment.repository";
import { PaymentResult } from "../domain/types/paymentResult.type";
import Model from "./models/payment.model";

export class PaymentInfraestructure implements PaymentRepository {
  async save(payment: Payment): Promise<PaymentResult> {
    try {
      await Model.create(payment);
    } catch (error) {
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      return err(resultErr);
    }
  }
}
