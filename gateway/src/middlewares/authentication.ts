import axios from "axios";
import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";
import AppService from "../services/app.service";

// verificar si viene el authorization por los headers
const existsHeaderAuthorization = (req: Request): boolean => {
  return !!req.headers.authorization;
};

// verificar si viene con el formato correcto
const isFormatRight = (req: Request): boolean => {
  const parts = req.headers.authorization.split(" ");
  return parts?.length !== 2 || parts[0] !== "Bearer" ? false : true;
};

const isAccessTokenValid = async (req: Request): Promise<boolean> => {
  const accessToken = req.headers.authorization.split(" ")[1];

  const request: unknown = {
    method: "POST",
    url: `${AppService.PATH_AUTH}/auth/validate-access-token`,
    responseType: "json",
    data: { token: accessToken }
  };

  try {
    const result = await axios(request);
    return result.data?.valid ? true : false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

const setUserId = (req: Request, res: Response) => {
  const accessToken = req.headers.authorization.split(" ")[1] as string;
  try {
    const payload: any = jwt_decode(accessToken); // any
    res.locals.userId = payload.userId;
  } catch (error) {
    console.log("error setUserId", error);
  }
};

// final middleware
export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!existsHeaderAuthorization(req) || !isFormatRight(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("header authorization exists");

    if (!isAccessTokenValid(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("access token is valid");

    setUserId(req, res);
    next();
};
