import { Request, Response, NextFunction } from 'express';
import { initRedisClient } from '../config/redisClient';

export const withRedisClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.redisClient = await initRedisClient();
    next();
  } catch (error) {
    next(error);
  }
};
