import mongoose from "mongoose";

class PaymentModel {
  private readonly paymentSchema: mongoose.Schema;

  constructor() {
    this.paymentSchema = new mongoose.Schema({
      transactionId: {
        type: String,
        required: true
      },
      productId: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      createdAt: {
        type: Date,
        required: true
      },
      updatedAt: {
        type: Date,
        required: false
      },
      deletedAt: {
        type: Date,
        required: false
      },
      status: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        required: true
      }
    });
  }

  get model() {
    return mongoose.model("Payment", this.paymentSchema);
  }
}

export default new PaymentModel().model;
