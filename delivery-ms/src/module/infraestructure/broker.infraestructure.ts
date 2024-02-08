import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";
import Model from "./models/delivery.model";
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<void> {
    const channel = BrokerBootstrap.channel;
    const exchangeName = process.env.EXCHANGE_NAME || "exchange-order";
    const exchangeType = process.env.EXCHANGE_TYPE || "fanout";
    const routingKey = process.env.ROUTING_KEY || "";

    await channel.assertExchange(exchangeName, exchangeType, { durable: true });
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
  }

  async sentError(message: unknown): Promise<any> {
    const channel = BrokerBootstrap.channel;
    const exchangeName = process.env.EXCHANGE_NAME_REJECT || "exchange-reject";
    const exchangeType = process.env.EXCHANGE_TYPE_REJECT || "topic";
    const routingKey = process.env.ROUTING_KEY_REJECT || "delivery.error";

    console.log("Sent error: ", message);

    await channel.assertExchange(exchangeName, exchangeType, { durable: true });
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message))
    )
  }

  async receive(): Promise<any> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME_RECEIVE_ORDER || "queue-order-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept.bind(this));
  }

  async consumerAccept(message: any) {
    const content = JSON.parse(message.content.toString());
    content.status = "APPROVED";
    await Model.create(content);
    UtilsConfirmBrokerService.confirmMessage(BrokerBootstrap.channel, message);
    //this.sent(content);
    this.sentError(content); // para forzar el error
  }

  async consumerOrderConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString());
    console.log("Delivery confirmed: ", messageParse);
    const { transactionId } = messageParse;

    const order = await Model.findOne({ transactionId });

    if (order) {
      await Model.updateOne({ transactionId }, { status: "APPROVED" });
    }

    console.log("Order confirmed: ", transactionId);

    BrokerBootstrap.channel.ack(message);
  }
}
