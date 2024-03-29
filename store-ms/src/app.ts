import express, { Application } from "express";
import { StoreInfraestructure } from "./module/infraestructure/store.infraestructure";
import { StoreApplication } from "./module/application/store.application";
import Controller from "./module/interface/http/store.controller";
import storeRouter from "./module/interface/http/router";
import { StoreRepository } from "./module/domain/repositories/store.repository";
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

    const infraestructure: StoreRepository = new StoreInfraestructure();
    const broker: BrokerRepository = new BrokerInfraestructure();
    const application = new StoreApplication(infraestructure, broker);
    const controller = new Controller(application);
    const router = new storeRouter(controller);

    // design pattern Chain of Responsability: https://refactoring.guru/es/design-patterns/chain-of-responsibility
    this.expressApp.use("/", (_req, res) => res.send("All is OK"));
    // this.expressApp.use("/store", router.router);
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
