// utils/productCacheMiddleware.ts

import { Request, Response, NextFunction } from "express";
import Product from "../models/productModals/Product.Model";
import { getProductKeyById } from "../utils/redisKeys";
import CustomError from "../utils/customError";
import { CACHE_TTL_SECONDS } from "../utils/constants";

export const checkProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cacheKey = getProductKeyById(id);
    const cachedProduct = await req.redisClient.get(cacheKey);

    if (cachedProduct) {
      req.product = JSON.parse(cachedProduct);
      return next();
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};
export const cacheProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  try {
    const product = req.product;
    const cacheKey = getProductKeyById(product._id.toString());
    await req.redisClient.setEx(
      cacheKey,
      CACHE_TTL_SECONDS,
      JSON.stringify(product)
    );
    next();
  } catch (error) {
    next(error);
  }
};
