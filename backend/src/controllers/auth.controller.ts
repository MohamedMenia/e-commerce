import { Request, Response, NextFunction } from "express";
import User from "../models/User.Modal";
import { successResponse } from "../utils/responseHandler";
import {
  generateToken,
  generateRefreshToken,
  setTokenCookies,
} from "../services/authService";
import { OAuth2Client } from "google-auth-library";
import CustomError from "../utils/customError";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    // If user registered with Google
    if (user.googleId && !user.password) {
      throw new CustomError(
        "This account is registered with Google. Please use Google login.",
        400
      );
    }

    if (!(await user.comparePassword(password))) {
      throw new CustomError("Invalid email or password", 401);
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    setTokenCookies(res, accessToken, refreshToken);

    successResponse(res, { user }, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload?.sub;
    const email = payload?.email;
    const username = payload?.name;

    if (!email || !username) {
      throw new CustomError(
        "Google login failed: Missing required user information",
        400
      );
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, email, username });
      await user.save();
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    successResponse(res, { user }, "Google login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("refreshJwt");
    successResponse(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};
