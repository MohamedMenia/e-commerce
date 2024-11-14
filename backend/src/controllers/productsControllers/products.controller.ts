import { NextFunction, Request, Response } from "express";
import Product from "../../models/productModals/Product.Model";
import ApiFeatures from "../../utils/ApiFeatures";
import { successResponse } from "../../utils/responseHandler";
import {
  handleProductImages,
  deleteProductImages,
} from "../../utils/handleProductImages";
import { getProductKeyById, getProductListKey } from "../../utils/redisKeys";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cacheKey = getProductListKey(JSON.stringify(req.query));
    const cachedProducts = await req.redisClient.get(cacheKey);
    if (cachedProducts) {
      return successResponse(
        res,
        JSON.parse(cachedProducts),
        "Products retrieved from cache"
      );
    }
    const features = new ApiFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .search();

    const [totalPages, products] = await Promise.all([
      features.getTotalPages(),
      features.query,
    ]);
    const response = { products, totalPages };
    await req.redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
    successResponse(res, response, "Products retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, details, brand, category, sellers, reviews, sizes } =
      req.body;
    // Handling images
    const imgs = await handleProductImages(req, { imgs: {} });

    const newProduct = {
      name,
      details,
      brand,
      category,
      sellers,
      reviews,
      sizes,
      imgs,
    };
    const product = await Product.create(newProduct);
    successResponse(res, product, "Product created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateData = req.body;
    const product = req.product;

    const imgUpdateResult = await handleProductImages(req, product);
    updateData.imgs = { ...product.imgs, ...imgUpdateResult };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedProduct) {
      await updatedProduct.save();
      const cacheKey = getProductKeyById(req.params.id);
      await req.redisClient.setEx(
        cacheKey,
        3600,
        JSON.stringify(updatedProduct)
      );
    }

    successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    // Delete all images from Cloudinary
    await deleteProductImages(product);

    // Delete the product from the cach
    const cacheKey = getProductKeyById(req.params.id);
    await req.redisClient.del(cacheKey);

    successResponse(res, product, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.product;
    successResponse(res, product, "Product retrieved successfully");
  } catch (error) {
    next(error);
  }
};
