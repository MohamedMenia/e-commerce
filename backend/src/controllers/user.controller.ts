import  { Request, Response, NextFunction } from "express";
import User from "../modals/User.Modal";
import { successResponse } from "../utils/responseHandler";
import cloudinary from "../config/cloudinary";

// Create a new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const img = req.file?.path;
    const imgPublicId = req.file?.filename;

    const user = new User({ username, email, password, img, imgPublicId });
    await user.save();

    successResponse(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
};

// Update an existing user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const img = req.file?.path;
    const imgPublicId = req.file?.filename;

    const user = req.user;

    // Delete the old photo if a new one is uploaded
    if (user.imgPublicId && imgPublicId) {
      await cloudinary.uploader.destroy(user.imgPublicId);
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }
    if (img && imgPublicId) {
      user.img = img;
      user.imgPublicId = imgPublicId;
    }

    await user.save();

    successResponse(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

// Get user details
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    

    // Delete the user's photo from Cloudinary
    if (user.imgPublicId) {
      await cloudinary.uploader.destroy(user.imgPublicId);
    }

    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
