import mongoose, { Schema, Document, model } from "mongoose";

export interface IReview extends Document {
  _id:  mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
