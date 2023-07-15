import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";
import BrokerBootstrap from "./bootstrap/broker.bootstrap";
import { PaymentApplication } from "./module/application/payment.application";
import { PaymentRepository } from "./module/domain/repositories/payment.repository";
import { PaymentInfraestructure } from "./module/infraestructure/payment.infraestructure";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";
import BrokerController from "./module/interface/broker/broker.controller";

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();
const broker = new BrokerBootstrap();

const paymentInfraestructure: PaymentRepository = new PaymentInfraestructure();
const brokerInfraestructure: BrokerRepository = new BrokerInfraestructure();
const paymentApplication: PaymentApplication = new PaymentApplication(paymentInfraestructure, brokerInfraestructure);
const brokerController = new BrokerController(paymentApplication);

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
