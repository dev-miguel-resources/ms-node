import { err } from "neverthrow";
import { IError } from "../../core/exceptions/error.exception";
import { Delivery } from "../domain/delivery";
import { DeliveryRepository } from "../domain/repositories/delivery.repository";
import { DeliveryResult } from "../domain/types/deliveryResult.type";
import Model from "./models/delivery.model";

export class DeliveryInfraestructure implements DeliveryRepository {
  async save(delivery: Delivery): Promise<DeliveryResult> {
    try {
      await Model.create(delivery);
    } catch (error) {
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      return err(resultErr);
    }
  }
}
