import { Delivery } from "../delivery";
import { DeliveryResult } from "../types/deliveryResult.type";

export interface DeliveryRepository {
  save(delivery: Delivery): Promise<DeliveryResult>;
}
