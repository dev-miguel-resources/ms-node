import { Order } from "../order";
import { OrderResult } from "../types/orderResult.type";

// Solid Principle: Inversion of Dependency
// Design Pattern Facade
export interface OrderRepository {
  save(order: Order): Promise<OrderResult>;
}
