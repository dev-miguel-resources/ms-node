import amqp from "amqplib";

export default class UtilsConfirmBrokerService {
  static confirmMessage(channel: amqp.Channel, message: amqp.Message) {
    channel.ack(message);
  }
}
