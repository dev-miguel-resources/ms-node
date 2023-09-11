import { NextFunction, Request, Response } from "express";

export type middleware = (req: Request, res: Response, next: NextFunction) => void;