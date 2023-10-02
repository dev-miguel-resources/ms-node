import { err, ok } from "neverthrow";
import { Order } from "../domain/order";
import { OrderRepository } from "../domain/repositories/order.repository";
import { OrderResult } from "../domain/types/orderResult.type";
import Model from "./models/order.model";
import { IError } from "../../core/exceptions/error.exception";

export class OrderInfraestructure implements OrderRepository {
  async save(order: Order): Promise<OrderResult> {
    try {
      await Model.create(order);
      return ok(order);
    } catch (error) {
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      return err(resultErr);
    }
  }
}
