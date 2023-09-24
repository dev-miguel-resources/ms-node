import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";
import Model from "./models/delivery.model";
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<void> {
    const channel = BrokerBootstrap.channel;
    const exchangeName = process.env.EXCHANGE_NAME || "exchange-orders";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    await channel.assertExchange(exchangeName, exchangeType, { durable: true });
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
  }

  async receive(): Promise<void> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME_RECEIVE_STORE || "queue-store-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept.bind(this));
  }

  async consumerAccept(message: Message) {
    const content = JSON.parse(message.content.toString());
    await Model.create(content);
    UtilsConfirmBrokerService.confirmMessage(BrokerBootstrap.channel, message);
    this.sent(content);
  }

  // agregar detalle de finalizado
  async consumerDeliveryConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString());
    console.log(messageParse);
    BrokerBootstrap.channel.ack(message);
  }
}
