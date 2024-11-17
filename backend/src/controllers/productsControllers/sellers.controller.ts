import { NextFunction, Request, Response } from "express";
import Seller from "../../models/productModals/Seller.Model";
import Product from "../../models/productModals/Product.Model";
import { successResponse } from "../../utils/responseHandler";
import CustomError from "../../utils/customError";

export const addProductToSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId, productId, price, stock } = req.body;

    // Add product to seller
    const updatedSeller = await Seller.updateOne(
      { _id: sellerId },
      { $push: { products: { product: productId, price, stock } } }
    );

    // Add seller to product
    const updatedProduct = await Product.updateOne(
      { _id: productId },
      { $push: { sellers: sellerId } }
    );

    successResponse(
      res,
      { updatedSeller, updatedProduct },
      "Product added to seller successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateSellerProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId, productId, price, stock } = req.body;

    const updatedSeller = await Seller.updateOne(
      { _id: sellerId, "products.product": productId },
      {
        $set: {
          "products.$.price": price,
          "products.$.stock": stock,
        },
      }
    );

    successResponse(res, updatedSeller, "Seller product updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSellerProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId, productId } = req.body;

    // Remove product from seller
    const updatedSeller = await Seller.updateOne(
      { _id: sellerId },
      { $pull: { products: { product: productId } } }
    );

    // Remove seller from product
    const updatedProduct = await Product.updateOne(
      { _id: productId },
      { $pull: { sellers: sellerId } }
    );

    successResponse(res, { updatedSeller, updatedProduct }, "Seller and product association deleted successfully");
  } catch (error) {
    next(error);
  }
};
