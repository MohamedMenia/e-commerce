class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (details) this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
