import { Request, Response, NextFunction } from "express";
import User from "../modals/User.Modal";
import { successResponse } from "../utils/responseHandler";
import cloudinary from "../config/cloudinary";
import { getUserKeyById } from "../utils/redisKeys";
import { CACHE_TTL_SECONDS } from "../utils/constants";
import { deletePhoto } from "../config/multerConfig";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const img = req.file?.path;
    const imgPublicId = req.file?.filename;
    const redisClient = req.redisClient;
    const user = new User({ username, email, password, img, imgPublicId });
    await user.save();
    await redisClient.setEx(
      getUserKeyById(user._id),
      CACHE_TTL_SECONDS,
      JSON.stringify(user)
    );
    successResponse(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const img = req.file?.path;
    const imgPublicId = req.file?.filename;
    const redisClient = req.redisClient;

    // Gather updated fields
    const updates: any = {
      username: username || undefined,
      email: email || undefined,
      password: password || undefined,
      img: img || undefined,
      imgPublicId: imgPublicId || undefined,
    };

    // Remove undefined values to avoid updating unwanted fields
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    // If updating image, delete old image
    if (req.user.imgPublicId && imgPublicId) {
      await deletePhoto(req.user.imgPublicId);
    }

    await redisClient.setEx(
      getUserKeyById(req.user._id),
      CACHE_TTL_SECONDS,
      JSON.stringify(user)
    );

    successResponse(res, user, "User updated successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const redisClient = req.redisClient;

    if (user.imgPublicId) {
      await deletePhoto(user.imgPublicId);
    }
    
    await redisClient.del(getUserKeyById(user._id));
    await User.findByIdAndDelete(user._id);
    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
