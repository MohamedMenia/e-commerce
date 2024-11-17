import mongoose, { Schema, Document, model } from "mongoose";
import { IProduct } from "./Product.Model";

export interface ISeller extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId; 
  products: {
    product: mongoose.Schema.Types.ObjectId; 
    price: number;
    stock: number;
  }[];
}

const sellerSchema = new Schema<ISeller>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
    },
  ],
});

  

const Seller = model<ISeller>("Seller", sellerSchema);

export default Seller;
