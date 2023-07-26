import express, { Application } from "express";
import { DeliveryInfraestructure } from "./module/infraestructure/delivery.infraestructure";
import { DeliveryApplication } from "./module/application/delivery.application";
import Controller from "./module/interface/http/delivery.controller";
import deliveryRouter from "./module/interface/http/router";
import { DeliveryRepository } from "./module/domain/repositories/delivery.repository";
import { BrokerRepository } from "./module/domain/repositories/broker.repository";
import { BrokerInfraestructure } from "./module/infraestructure/broker.infraestructure";

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

    const infraestructure: DeliveryRepository = new DeliveryInfraestructure();
    const broker: BrokerRepository = new BrokerInfraestructure();
    const application = new DeliveryApplication(infraestructure, broker);
    const controller = new Controller(application);
    const router = new deliveryRouter(controller);

    // design pattern Chain of Responsability: https://refactoring.guru/es/design-patterns/chain-of-responsibility
    this.expressApp.use("/", (_req, res) => res.send("All is OK"));
    // this.expressApp.use("/delivery", router.router);
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
