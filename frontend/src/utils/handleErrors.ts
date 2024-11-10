import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { toast } from "react-toastify";

// Define TypeScript interfaces
interface IErrorDetails {
  validation: string;
  message: string;
  path: string[];
}

interface IErrorResponse {
  success: boolean;
  error: {
    message: string;
    details?: IErrorDetails[];
  };
}

// Helper function to handle errors with a generic type
const handleErrors = <T extends FieldValues>(
  error: IErrorResponse,
  setError: UseFormSetError<T>| null
) => {
  if (error.error.details && setError) {
    error.error.details.forEach((detail: IErrorDetails) => {
        setError(detail.path[0] as Path<T>, {
            type: detail.validation,
            message: detail.message,
          });
    });
  } else {
    toast.error(error.error.message);
  }
};

export default handleErrors;
