import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import Controller from "./order.controller";
import { InsertValidator } from "../validators/insert.validator";
import { BadRequestErrorException } from "../../../core/exceptions/badRequest.exception";

export default class {
  private readonly expressRouter: express.Router;

  constructor(private readonly controller: Controller) {
    this.expressRouter = express.Router();
    this.mountRoutes();
  }

  validator(instance: InsertValidator) {
    return (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      Object.assign(instance, body);
      validate(instance).then(errors => {
        if (errors.length > 0) {
          /*res.status(411).json(errors);
          throw new BadRequestErrorException(JSON.stringify(errors));
          */
          // return next(BadRequestErrorException(JSON.stringify(errors));
          const errorMessages = errors.map(err => Object.values(err.constraints)).flat()
          return next(res.status(400).json({ error: 'Invalid request', messages: errorMessages }))
        } else {
          next();
        }
      });
    };
  }

  mountRoutes() {
    this.expressRouter.post("/", this.validator(new InsertValidator()), this.controller.insertOrder);
  }

  get router() {
    return this.expressRouter;
  }
}
