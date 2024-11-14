import { Request, Response, NextFunction } from "express";
import User from "../models/User.Modal";
import { successResponse } from "../utils/responseHandler";
import { getUserKeyById } from "../utils/redisKeys";
import { CACHE_TTL_SECONDS } from "../utils/constants";
import { deletePhoto } from "../config/multerConfig";
import { emitUserUpdate } from "../config/socketConfig";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, phone } = req.body;
    const img = {
      link: req.file?.path,
      publicId: req.file?.filename,
    };
    const redisClient = req.redisClient;
    const user = new User({
      username,
      email,
      password,
      img,
      phone,
    });
    await user.save();
    await redisClient.setEx(
      getUserKeyById(user._id.toString()),
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
    const { username, email, password, phone } = req.body;
    const img = {
      link: req.file?.path,
      publicId: req.file?.filename,
    };
    const redisClient = req.redisClient;

    // Gather updated fields
    const updates: any = {
      username: username || undefined,
      email: email || undefined,
      password: password || undefined,
      img: img || undefined,
      phone: phone || undefined,
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
    if (user?.img?.publicId && img?.publicId) {
      await deletePhoto(user.img.publicId);
    }

    await redisClient.setEx(
      getUserKeyById(req.user._id.toString()),
      CACHE_TTL_SECONDS,
      JSON.stringify(user)
    );
    emitUserUpdate(user?._id.toString() || "");

    successResponse(res, user, "User updated successfully");
  } catch (error) {
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

    if (user.img.link) {
      await deletePhoto(user.img.publicId);
    }

    await redisClient.del(getUserKeyById(user._id.toString()));
    await User.findByIdAndDelete(user._id);
    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
