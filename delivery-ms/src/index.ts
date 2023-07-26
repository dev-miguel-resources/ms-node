import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import BrokerBootstrap from "./bootstrap/broker.bootstrap";
import { DeliveryApplication } from "./module/application/delivery.application";
import { DeliveryRepository } from "./module/domain/repositories/delivery.repository";
import { DeliveryInfraestructure } from "./module/infraestructure/delivery.infraestructure";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import BrokerController from "./module/interface/broker/broker.controller";

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrokerBootstrap();

const deliveryInfraestructure: DeliveryRepository = new DeliveryInfraestructure();
const brokerInfraestructure: BrokerRepository = new BrokerInfraestructure();
const deliveryApplication: DeliveryApplication = new DeliveryApplication(deliveryInfraestructure, brokerInfraestructure);
const brokerController = new BrokerController(deliveryApplication);

(async () => {
    try {
        const listPromises = [server.initialize(), database.initialize(), broker.initialize()];
        await Promise.all(listPromises);
        await brokerController.listen();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
