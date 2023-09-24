import axios, { AxiosRequestConfig } from "axios";
import express, { Request, Response, Application } from "express";
import AppService from "./services/app.service";
import { Routes } from "./interfaces/route.type";
import { Route } from "./interfaces/routeProps.interface";
// middlewares pendientes

class App {
  readonly expressApp: any; // pendiente del tipo correcto

  private readonly routes: Routes = [
    {
      origin: "/api/order",
      target: `${AppService.PATH_ORDER}/order`,
      method: "POST",
      middlewares: []
    }
  ];

  constructor() {
    this.expressApp = express()
    this.mountMiddlewares();
    this.mountRoutes();
  }

  mountMiddlewares() {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  mountRoutes(): void {
    console.log("this.routes", this.routes);
    this.routes.forEach(route => {
      const { origin, middlewares } = route;
      const method = route.method.toLowerCase();
      this.expressApp[method](origin, ...middlewares, this.execute(route));
    });

    this.expressApp.get("/", (_req: Request, res: Response) => {
      res.send("All's ok");
    });
  }

  // algoritmo de resolución de llamadas -> apis a los ms
  execute(route: Route) {
    return async (req: Request, res: Response) => {
      const request: AxiosRequestConfig<unknown> = {
        method: route.method,
        url: route.target,
        responseType: "json",
        data: { ...req.body }
      };

      console.log("request", request);

      try {
        const result = await axios(request);
        res.json(result.data);
      } catch (error) {
        res.json({ error });
      }
    };
  }
}

export default new App().expressApp;
