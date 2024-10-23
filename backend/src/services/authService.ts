import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../modals/User.Modal";
import CustomError from "../utils/customError";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1h";
const JWT_REFRESH_EXPIRES_IN = "30d";

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
    const token = req.cookies.jwt;
    const refreshToken = req.cookies.refreshJwt;

    if (!token && !refreshToken) {
      throw new CustomError("Authentication token not found", 401);
    }

    let decoded: any;
    let user: any;
    if (token) {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      user = await User.findById(decoded.id);
    }

    if (!user && refreshToken) {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
      user = await User.findById(decoded.id);

      if (user) {
        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        setTokenCookies(res, newToken, newRefreshToken);
      }
    }

    if (!user) {
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
