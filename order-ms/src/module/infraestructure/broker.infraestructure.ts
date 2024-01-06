import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";
import Model from "./models/order.model";
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

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
    
    const exchangeNameReject = process.env.EXCHANGE_NAME_REJECT || "exchange-reject";
    const exchangeTypeReject = process.env.EXCHANGE_TYPE_REJECT || "topic";
    const routingKeyReject = process.env.ROUTING_KEY_REJECT || "*.error";

    await ReceiveMessageService.orderConfirmedOrRejected(
      channel,
      this.consumerReject.bind(this),
      exchangeNameReject,
      exchangeTypeReject,
      routingKeyReject
    )
    
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

  async consumerReject(message: any) { // revisar any
    const content = JSON.parse(message.content.toString());
    await Model.updateOne(
      { transactionId: content.transactionId },
      { status: "CANCELLED" }
    );
    UtilsConfirmBrokerService.confirmMessage(BrokerBootstrap.channel, message);
  }
}
