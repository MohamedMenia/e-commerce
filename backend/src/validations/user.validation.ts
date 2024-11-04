import { z } from "zod";

// Phone number regex to match international formats
const phoneRegex = /^(\+\d{1,3})?,?\s?\d{8,13}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const passwordErrorMessage =
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";

  
export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(passwordRegex, passwordErrorMessage),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const updateUserSchema = z.object({
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().regex(passwordRegex, passwordErrorMessage).optional(),
  phone: z.string().regex(phoneRegex, "Invalid phone number").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const googleLoginSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
