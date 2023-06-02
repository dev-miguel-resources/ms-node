import amqp from 'amqplib'

// servicio de recepción de mensajes para abstraer la lógica de infraestructure
export default class ReceiveMessageService {

    static async orderConfirmedOrRejected(
        channel: amqp.Channel, // channel
        cb: (message: unknown) => void, // callback para procesar el mensaje
        exchangeName: string, // nombre del intercambiador
        exchangeType: string, // tipo del intercambiador
        routingKey: string // llaves de reconocimiento para la comunicación entre el exchange y la colas
    ) {
        await channel.assertExchange(exchangeName, exchangeType, { durable: true });

        const assertQueue = await channel.assertQueue("", { exclusive: true });

        channel.bindQueue(assertQueue.queue, exchangeName, routingKey);

        channel.consume(assertQueue.queue, (message) => cb(message), {
            noAck: false,
        });
    }
}