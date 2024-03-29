import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import BrokerBootstrap from "./bootstrap/broker.bootstrap";
import { StoreApplication } from "./module/application/store.application";
import { StoreRepository } from "./module/domain/repositories/store.repository";
import { StoreInfraestructure } from "./module/infraestructure/store.infraestructure";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import BrokerController from "./module/interface/broker/broker.controller";

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrokerBootstrap();

const storeInfraestructure: StoreRepository = new StoreInfraestructure();
const brokerInfraestructure: BrokerRepository = new BrokerInfraestructure();
const storeApplication: StoreApplication = new StoreApplication(storeInfraestructure, brokerInfraestructure);
const brokerController = new BrokerController(storeApplication);

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
