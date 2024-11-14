import { Request, Response, NextFunction } from "express";
import Review from "../../models/productModals/ProductReviews.Model";
import { successResponse } from "../../utils/responseHandler";
import CustomError from "../../utils/customError";
import ApiFeatures from "../../utils/ApiFeatures";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Create a new review
    const newReview = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    // Update product's rating average and review count
    const product = req.product;
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    product.reviewCount += 1;
    product.ratingAvg =
      (product.ratingAvg * (product.reviewCount - 1) + rating) /
      product.reviewCount;
    product.reviews.push(newReview._id);

    await product.save();

    successResponse(res, newReview, "Review created successfully");
  } catch (error) {
    next(error);
  }
};

export const getPaginatedReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.product;
    const reviewIds = product.reviews; 

    if (!reviewIds || reviewIds.length === 0) {
      return successResponse(
        res,
        { reviews: [], totalReviews: 0, currentPage: 1, totalPages: 0 },
        "No reviews available for this product"
      );
    }

    // Fetch paginated reviews using ApiFeatures with filtering
    const features = new ApiFeatures(
      Review.find({ _id: { $in: reviewIds } }),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const [totalPages, reviews] = await Promise.all([
      features.getTotalPages(),
      features.query,
    ]);

    const response = {
      reviews,
      totalReviews: totalPages * (Number(req.query.limit) || 10),
      currentPage: req.query.page || 1,
      totalPages: totalPages,
    };

    successResponse(res, response, "Paginated reviews retrieved successfully");
  } catch (error) {
    next(error);
  }
};
