import express, { Application } from "express";
import { PaymentInfraestructure } from "./module/infraestructure/payment.infraestructure";
import { PaymentApplication } from "./module/application/payment.application";
import Controller from "./module/interface/http/payment.controller";
import paymentRouter from "./module/interface/http/router";
import { PaymentRepository } from "./module/domain/repositories/payment.repository";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";

// esto volverlo atrás luego
class App {
  private readonly expressApp: Application;

  constructor() {
    this.expressApp = express();
    this.mountMiddlewares();
    this.mountRoutes();
  }

  mountMiddlewares() {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  mountRoutes() {

    const infraestructure: PaymentRepository = new PaymentInfraestructure();
    const broker: BrokerRepository = new BrokerInfraestructure();
    const application = new PaymentApplication(infraestructure, broker);
    const controller = new Controller(application);
    const router = new paymentRouter(controller);

    // design pattern Chain of Responsability: https://refactoring.guru/es/design-patterns/chain-of-responsibility
    this.expressApp.use("/", (_req, res) => res.send("All is OK"));
    // this.expressApp.use("/payment", router.router);
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
