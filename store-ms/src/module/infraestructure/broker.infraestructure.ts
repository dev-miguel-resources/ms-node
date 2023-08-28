import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";
import Model from "./models/store.model";
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<unknown> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME || "store";
    await channel.assertQueue(queueName, { durable: true });
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async receive(): Promise<void> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME_RECEIVE_PAYMENT || "queue-payment-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept.bind(this));

    const exchangeName = process.env.EXCHANGE_NAME || "exchange-orders";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    return await ReceiveMessageService.orderConfirmed(
      channel,
      this.consumerOrderConfirmed.bind(this),
      exchangeName,
      exchangeType,
      routingKey
    );
  }

  async consumerAccept(message: Message) {
    const content = JSON.parse(message.content.toString());
    await Model.create(content);
    UtilsConfirmBrokerService.confirmMessage(BrokerBootstrap.channel, message);
    this.sent(content);
  }

  // identificar una orden y confirmar de acuerdo a un status de aceptación
  async consumerOrderConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString()); // recuperando el mensaje
    const { transactionId } = messageParse;
    const order = await Model.findOne({ transactionId });

    if (order) {
      await Model.updateOne({ transactionId }, { status: "APPROVED" });
    }

    BrokerBootstrap.channel.ack(message); // los mensajes siempre se confirman desde el canal
  }
}
