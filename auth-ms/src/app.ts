import express, { Application } from "express";

import { AuthApplication } from "./module/application/auth.application";
import { AuthInfraestructure } from "./module/infraestructure/auth.infraestructure";
import Controller from "./module/interface/http/auth.controller";
import AuthRouter from "./module/interface/http/router";

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

  // Route parents
  mountRoutes() {
    const repository = new AuthInfraestructure();
    const application = new AuthApplication(repository);
    const controller = new Controller(application);
    const router = new AuthRouter(controller);

    // design pattern Chain of Responsability: https://refactoring.guru/es/design-patterns/chain-of-responsibility
    this.expressApp.use("/auth", router.router);
    this.expressApp.use("/", (_req, res) => res.send("All is OK"));
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
