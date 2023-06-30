import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";

export class BrokerInfraestructure implements BrokerRepository {

  async sent(message: unknown): Promise<unknown> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME || "order";
    await channel.assertQueue(queueName, { durable: true });
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  // cambiar el intercambiador
  async receive(): Promise<unknown> {
    const channel = BrokerBootstrap.channel;
    const exchangeName = process.env.EXCHANGE_NAME || "exchange-orders";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    return await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerOrderConfirmed.bind(this),
      exchangeName,
      exchangeType,
      routingKey
    );
  }

  consumerOrderConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString()); // recuperando el mensaje
    console.log(messageParse);
    BrokerBootstrap.channel.ack(message); // los mensajes siempre se confirman desde el canal
  }
}
