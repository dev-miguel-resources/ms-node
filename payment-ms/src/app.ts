import express, { Application, Request, Response } from "express";

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
    this.expressApp.use("/", (_req: Request, res: Response) => res.send("All is ok!"));
  }

  get app() {
    return this.expressApp;
  }
}

export default new App().app;
