import { STATUS } from "./types/deliveryStatus.type";

export class Delivery {
  private readonly transactionId: string;
  private readonly productId: string;
  private readonly price: number;
  private quantity: number;
  private readonly createdAt: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;
  private active: boolean;
  private status: STATUS;

  constructor(transactionId: string, productId: string, price: number, quantity: number) {
    this.transactionId = transactionId;
    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
    this.createdAt = new Date();
    this.active = true;
    this.status = "APPROVED";
  }

  properties() {
    return {
      transactionId: this.transactionId,
      productId: this.productId,
      price: this.price,
      quantity: this.quantity,
      createdAt: this.createdAt
    };
  }

  update(quantity: number) {
    this.quantity = quantity;
    this.updatedAt = new Date();
  }

  delete() {
    this.active = false;
    this.deletedAt = new Date();
  }
}
