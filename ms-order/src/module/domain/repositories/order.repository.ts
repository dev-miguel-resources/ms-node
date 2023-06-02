import { Result } from "neverthrow";
import { Order } from "../order";
import { IError } from "../../../core/exceptions/error.exception";

export type OrderResult = Result<Order, IError>;

// Solid Principle: Inversion of Dependency
// Design Pattern Facade
export interface OrderRepository {
  save(order: Order): Promise<OrderResult>;
}
