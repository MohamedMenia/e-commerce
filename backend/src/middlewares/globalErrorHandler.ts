import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";
import { errorResponse } from "../utils/responseHandler";

const devErrors = (res: Response, error: CustomError) => {
  errorResponse(res, error.statusCode || 400, {
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrors = (
  res: Response,
  error: CustomError,
  clearCookies: boolean = false
) => {
  if (error.isOperational) {
    errorResponse(
      res,
      error.statusCode,
      {
        message: error.message,
        details: error.details || null,
      },
      clearCookies
    );
  } else {
    errorResponse(
      res,
      500,
      {
        message: "Something went wrong! Please try again later",
      },
      clearCookies
    );
  }
};

const castErrorHandler = (err: any): CustomError => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};

const dubKeyErrorHandler = (err: any): CustomError => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const msg = `Duplicate value: '${value}' for field: '${field}'. Please use another value.`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err: any): CustomError => {
  const errors = Object.values(err.errors).map((val: any) => val.message);
  const errorMessages = errors.join(", ");
  const msg = `Invalid input data: ${errorMessages}`;
  return new CustomError(msg, 400);
};

const jwtExpiredErrorHandler = (): CustomError => {
  return new CustomError("JWT has expired. Please login again", 401);
};

const jwtErrorHandler = (): CustomError => {
  return new CustomError("Invalid token. Please login again", 401);
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else {
    let clearCookies = false;
    if (error.code === 11000) error = dubKeyErrorHandler(error);
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "TokenExpiredError") {
      error = jwtExpiredErrorHandler();
      clearCookies = true;
    }
    if (error.name === "JsonWebTokenError") {
      error = jwtErrorHandler();
      clearCookies = true;
    }
    prodErrors(res, error, clearCookies);
  }
};

export default globalErrorHandler;
