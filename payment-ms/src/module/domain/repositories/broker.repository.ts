export interface BrokerRepository {
  sent(message: unknown): Promise<unknown>;
  // volver a su tipo anterior más tarde
  receive(): Promise<any>;
}
