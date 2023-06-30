import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<unknown> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME || "payment";
    await channel.assertQueue(queueName, { durable: true });
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  // modificar luego el any
  async receive(): Promise<any> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_ORDER_CREATED || "queue-order-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept);
  }

  async consumerAccept(message: Message) {
    const content = JSON.parse(message.content.toString());
    console.log(content);
  }

  consumerPaymentConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString());
    console.log(messageParse);
    BrokerBootstrap.channel.ack(message);
  }
}
