import { z } from "zod";

// Schema for creating a user
export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  img: z.string().url("Invalid URL").optional(),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
  img: z.string().url("Invalid URL").optional(),
});

// Schema for login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const googleLoginSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
