import * as express from "express";
import { IUser } from "../../modals/User.Modal";
import { RedisClientType } from "redis";

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
    redisClient: RedisClientType;

  }
}
