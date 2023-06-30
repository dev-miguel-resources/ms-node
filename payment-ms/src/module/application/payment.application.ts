import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Payment } from "../domain/payment";
import { BrokerRepository } from "../domain/repositories/broker.repository";
import { PaymentRepository } from "../domain/repositories/payment.repository";

export class PaymentApplication {
  private repositoryPayment: PaymentRepository;
  private repositoryBroker: BrokerRepository;

  constructor(repository: PaymentRepository, repositoryBroker: BrokerRepository) {
    this.repositoryPayment = repository;
    this.repositoryBroker = repositoryBroker;
  }

  async save(payment: Payment): Promise<Payment> {
    const paymentResult = await this.repositoryPayment.save(payment);
    if (paymentResult.isErr()) {
      throw new InternalServerErrorException(paymentResult.error.message);
    }
    await this.repositoryBroker.sent(paymentResult.value);

    return paymentResult.value;
  }

  async receive() {
    await this.repositoryBroker.receive();
  }
}
