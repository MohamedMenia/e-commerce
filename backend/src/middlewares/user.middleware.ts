import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

// Protect middleware to check if the user is authorized to access a specific resource
// It checks by checking if the user's ID matches the ID in the params or if the user is an admin
export const protectUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if the user's ID matches the ID in the params or if the user is an admin
    if (user._id.toString() !== id && user.role !== "admin") {
      throw new CustomError("Not authorized to access this resource", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
