import { InternalServerErrorException } from "../../core/exceptions/internalServer.exception";
import { Order } from "../domain/order";
import { BrokerRepository } from "../domain/repositories/broker.repository";
import { OrderRepository } from "../domain/repositories/order.repository";

export class OrderApplication {
  private repositoryOrder: OrderRepository;
  private repositoryBroker: BrokerRepository;

  // design pattern Dependency Injection: https://desarrolloweb.com/articulos/patron-diseno-contenedor-dependencias.html
  constructor(repository: OrderRepository, repositoryBroker: BrokerRepository) {
    this.repositoryOrder = repository;
    this.repositoryBroker = repositoryBroker;
  }

  async save(order: Order): Promise<Order> {
    const orderResult = await this.repositoryOrder.save(order);
    if (orderResult.isErr()) {
      throw new InternalServerErrorException(orderResult.error.message);
    }

    await this.repositoryBroker.sent(orderResult.value)

    return orderResult.value;
  }

  async receive() {
    await this.repositoryBroker.receive()
  }
}
