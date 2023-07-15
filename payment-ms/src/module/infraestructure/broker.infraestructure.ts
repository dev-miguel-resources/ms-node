import { BrokerRepository } from "../domain/repositories/broker.repository";
import BrokerBootstrap from "../../bootstrap/broker.bootstrap";
import ReceiveMessageService from "./services/receive-message.service";
import { Message } from "amqplib";
import Model from './models/payment.model';
import UtilsConfirmBrokerService from "./services/utils-confirm-broker.service";

export class BrokerInfraestructure implements BrokerRepository {
  async sent(message: unknown): Promise<unknown> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME || "payment";
    await channel.assertQueue(queueName, { durable: true });
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async receive(): Promise<void> {
    const channel = BrokerBootstrap.channel;
    const queueName = process.env.QUEUE_NAME_RECEIVE_ORDER || "queue-order-created";
    await ReceiveMessageService.accept(channel, queueName, this.consumerAccept.bind(this));
  }

  async consumerAccept(message: Message) {
    const content = JSON.parse(message.content.toString());
    // acá es donde luego de aceptar un mensaje debo consumirlo para luego pasarlo a mi cola respectiva de este ms
    // procesar esa lógica de integración con ese servicio: paypal, stripe, etc, mercado pago, etc...
    await Model.create(content);
    UtilsConfirmBrokerService.confirmMessage(BrokerBootstrap.channel, message);
    this.sent(content);
  }

  consumerPaymentConfirmed(message: Message) {
    const messageParse = JSON.parse(message.content.toString());
    console.log(messageParse);
    BrokerBootstrap.channel.ack(message);
  }
}
