import * as express from "express";
import { IUser } from "../../modals/User.Modal";

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
  }
}
