import  { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import CustomError from "../utils/customError";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = new CustomError(
        result.error.errors.map((err) => err.message).join(", "),
        400,
        result.error.errors
      );
      next(error);
    } else {
      next();
    }
  };
