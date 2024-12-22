import { z } from "zod";

// Phone number regex to match international formats
const phoneRegex = /^(\+\d{1,3})?,?\s?\d{8,13}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const passwordErrorMessage =
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";

export const userSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(passwordRegex, passwordErrorMessage),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const updateUserSchema = userSchema.partial();

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const googleLoginSchema = z.object({
  token: z.string(),
});
