import { z } from "zod";

const priceStockSchema = z.object({
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  img: z.object({
    main: z.string().url("Invalid image URL"),
    sub: z.array(z.string().url("Invalid image URL")).optional(),
  }),
  details: z.string().min(1, "Details are required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.object({
    main: z.string().min(1, "Main category is required"),
    sub: z.array(z.string()).optional(),
  }),
  sellers: z.array(
    z.object({
      seller: z.string().min(1, "Seller ID is required"),
      ...priceStockSchema.shape,
    })
  ),
  reviews: z
    .array(
      z.object({
        user: z.string().min(1, "User ID is required"),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1, "Comment is required"),
      })
    )
    .optional(),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        stock: z.number().nonnegative(),
      })
    )
    .optional(),
});

export const updateProductSchema = productSchema.partial();
