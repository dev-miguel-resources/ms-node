import axios, { AxiosRequestConfig } from "axios";
import express, { Request, Response, NextFunction, Application } from "express";
import AppService from "./services/app.service";
import { Routes } from "./interfaces/route.type";
import { Route } from "./interfaces/routeProps.interface";
// middlewares pendientes

class App {

    private readonly expressApp: any; // pendiente del tipo correcto

    private readonly routes: Routes = [
        {
            origin: "/api/order",
            target: `${AppService.PATH_ORDER}/order`,
            method: "POST",
            middlewares: []
        }
    ]

    constructor() {
        // methods
        this.mountMiddlewares();
        this.mountRoutes();
    }

    mountMiddlewares() {
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
    }

    mountRoutes(): void {
        console.log("this.routes", this.routes);
        this.routes.forEach((route) => {
            const { origin, middlewares } = route;
            const method = route.method.toLowerCase();
            this.expressApp[method](origin, ...middlewares, this.execute(route));
        });

        this.expressApp.get("/", (_req: Request, res: Response) => {
            res.send("All's ok");
        })
    }

    // algoritmo de resolución de llamadas -> apis a los ms
    execute(route: Route) {
        
    }
}