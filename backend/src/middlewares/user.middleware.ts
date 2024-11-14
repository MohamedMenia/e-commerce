import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";
import User from "../models/User.Modal";

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

export const checkPasswordAndUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword) {
    return next();
  }
  if (newPassword !== confirmPassword) {
    throw new CustomError("Passwords do not match", 400, {
      confirmPassword: "Passwords do not match",
    });
  }
  try {
    const user = req.user;
    if (!(await user.comparePassword(oldPassword))) {
      throw new CustomError("Old password is incorrect", 400, {
        oldPassword: "Old password is incorrect",
      });
    }
  
    // If passwords match, update the password in req.body
    req.body.password = newPassword;
    delete req.body.oldPassword;
    delete req.body.newPassword;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
