import jwt from "jsonwebtoken";
import User from "../modals/User.Modal";
import CustomError from "../utils/customError";
import { Request, Response, NextFunction } from "express";
import { getUserKeyById } from "../utils/redisKeys";
import {
  CACHE_TTL_SECONDS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../utils/constants";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyAndRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redisClient = req.redisClient;
    const token = req.cookies.jwt;
    const refreshToken = req.cookies.refreshJwt;

    if (!token && !refreshToken) {
      throw new CustomError("Authentication token not found", 401);
    }

    let decoded: any;
    let user: any;

    if (token) {
      try {
        decoded = verifyToken(token);
        const cachedUser = await redisClient.get(getUserKeyById(decoded.id));
        if (cachedUser) {
          user = JSON.parse(cachedUser);
        } else {
          user = await User.findById(decoded.id);
        }
      } catch (err) {
        //return next(err);
      }
    }

    if (!user && refreshToken) {
      try {
        decoded = verifyToken(refreshToken);
        const cachedUser = await redisClient.get(getUserKeyById(decoded.id));
        if (cachedUser) {
          user = JSON.parse(cachedUser);
        } else {
          user = await User.findById(decoded.id);
        }
      } catch (err) {
        return next(err);
      }
    }

    if (user) {
      const newToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);
      setTokenCookies(res, newToken, newRefreshToken);
      await redisClient.setEx(
        getUserKeyById(user._id),
        CACHE_TTL_SECONDS,
        JSON.stringify(user)
      ); // Cache user data
    } else {
      throw new CustomError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const setTokenCookies = (
  res: Response,
  token: string,
  refreshToken: string
) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshJwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
};