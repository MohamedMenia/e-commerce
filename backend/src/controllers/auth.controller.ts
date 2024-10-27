import { Request, Response, NextFunction } from "express";
import User from "../modals/User.Modal";
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

    if (!user || !(await user.comparePassword(password))) {
      const error = new CustomError("Invalid email or password", 401);
      return next(error);
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

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId });
      await user.save();
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

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
