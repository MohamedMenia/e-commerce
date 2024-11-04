export interface IErrorDetails {
  validation: string;
  code: string;
  message: string;
  path: string[];
}

export interface IErrorResponse {
  success: boolean;
  error: {
    message: string;
    details?: IErrorDetails[];
  };
}
