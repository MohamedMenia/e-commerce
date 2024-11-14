import * as express from "express";
import { IUser } from "../../models/User.Modal";
import { IProduct } from "../../models/productModals/Product.Model";
import { RedisClientType } from "redis";

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
    redisClient: RedisClientType;
    product:IProduct
  }
}
