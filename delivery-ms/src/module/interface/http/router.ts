import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import Controller from "./delivery.controller";
import { InsertValidator } from "../validators/insert.validator";

export default class {
  private readonly expressRouter: express.Router;

  constructor(private readonly controller: Controller) {
    this.expressRouter = express.Router();
  }

  validator(instance: InsertValidator) {
    return (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      Object.assign(instance, body);
      validate(instance).then(errors => {
        if (errors.length > 0) {
          const errorMessages = errors.map(err => Object.values(err.constraints)).flat();
          return next(res.status(400).json({ error: "Invalid request", messages: errorMessages }));
        } else {
          next();
        }
      });
    };
  }

  mountRoutes() {
    this.expressRouter.post("/", this.validator(new InsertValidator()), this.controller.insertDelivery);
  }

  get router() {
    return this.expressRouter;
  }
}
