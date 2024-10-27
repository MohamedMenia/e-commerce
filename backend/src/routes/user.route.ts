import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validat.middleware";
import * as validationSchema from "../validations/user.validation";
import { uploadUserPhoto } from "../config/multerConfig";
import { verifyAndRefreshToken } from "../services/authService";
import { withRedisClient } from "../middlewares/redisMiddleware";
import {protectUser} from "../middlewares/user.middleware";
const router = Router();

// Auth Routes
router.post(
  "/login",
  validate(validationSchema.loginSchema),
  authController.login
);
router.post(
  "/google-login",
  validate(validationSchema.googleLoginSchema),
  authController.googleLogin
);
router.post("/logout", authController.logout);

// User Routes
router.post(
  "/",
  validate(validationSchema.userSchema),
  withRedisClient,
  userController.createUser
);
router.put(
  "/:id",
  withRedisClient,
  verifyAndRefreshToken,
  uploadUserPhoto.single("photo"),
  validate(validationSchema.updateUserSchema),
  protectUser,
  userController.updateUser
);
router.delete(
  "/:id",
  withRedisClient,
  verifyAndRefreshToken,
  protectUser,
  userController.deleteUser
);

router.get(
  "/:id",
  withRedisClient,
  verifyAndRefreshToken,
  protectUser,
  userController.getUser
);

export default router;
