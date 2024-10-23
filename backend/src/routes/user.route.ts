import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validat.middleware";
import * as validationSchema from "../validations/user.validation";
import { uploadUserPhoto } from "../config/multerConfig";
import { verifyAndRefreshToken } from "../services/authService";

const router = Router();

// Auth Routes
router.post(
  "/login",
  validate(validationSchema.loginSchema),
  authController.login
);
router.post(
  "/google-login",
  validate(validationSchema.loginSchema),
  authController.googleLogin
);
router.post("/logout", authController.logout);

// User Routes
router.post(
  "/register",
  validate(validationSchema.userSchema),
  userController.createUser
);
router.put(
  "/update",
  verifyAndRefreshToken,
  uploadUserPhoto.single("photo"),
  validate(validationSchema.updateUserSchema),
  userController.updateUser
);
router.delete("/delete", verifyAndRefreshToken, userController.deleteUser);

export default router;
