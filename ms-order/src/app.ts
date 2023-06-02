import express, { Application } from "express";
import { OrderInfraestructure } from "./module/infraestructure/order.infraestructure";
import { OrderApplication } from "./module/application/order.application";
import Controller from "./module/interface/http/order.controller";
import OrderRouter from "./module/interface/http/router";
import { OrderRepository } from "./module/domain/repositories/order.repository";
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

    const infraestructure: OrderRepository = new OrderInfraestructure();
    const broker: BrokerRepository = new BrokerInfraestructure();
    const application = new OrderApplication(infraestructure, broker); // pendiente de agregar el broker
    const controller = new Controller(application);
    const router = new OrderRouter(controller);

    // design pattern Chain of Responsability: https://refactoring.guru/es/design-patterns/chain-of-responsibility
    this.expressApp.use("/order", router.router);
    this.expressApp.use("/", (_req, res) => res.send("All is OK"));
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
