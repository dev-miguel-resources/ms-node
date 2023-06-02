import { v4 as uuidv4 } from "uuid";
import { Order } from "./order";

// design pattern abstractFactory: https://refactoring.guru/es/design-patterns/abstract-factory
export class OrderFactory {
  static create(productId: string, price: number, quantity: number): Order {
    if (price <= 0) {
      throw new Error("Price has to be greater than zero");
    }

    if (quantity <= 0) {
      throw new Error("Quantity has to be greater than zero");
    }

    const transactionId = uuidv4();

    return new Order(transactionId, productId, price, quantity);
  }
}

