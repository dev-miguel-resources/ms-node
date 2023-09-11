import { middleware } from "./middleware.type";

export interface Route {
    origin: string;
    target: string;
    method: "POST";
    middlewares: middleware[];
}