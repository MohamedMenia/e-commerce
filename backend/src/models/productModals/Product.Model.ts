import mongoose, { Schema, Document, model } from "mongoose";
import Seller from "./Seller.Model";

export interface IProduct extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  imgs: {
    main: {
      link: string;
      publicId: string;
    };
    sub: {
      link: string;
      publicId: string;
    }[];
  };
  details: string; // RichTextInput as a string
  minPrice: number;
  brand: string;
  category: mongoose.Schema.Types.ObjectId[];
  stock: number;
  sellers: mongoose.Schema.Types.ObjectId[]; // Reference to the seller's IDs
  reviews: mongoose.Schema.Types.ObjectId[];
  ratingAvg: number;
  reviewCount: number;
  sizes: {
    size: string;
    stock: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the product
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    imgs: {
      main: {
        link: { type: String, required: true },
        publicId: { type: String, required: true },
      },
      sub: [
        {
          link: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
    },
    details: { type: String, required: true },
    brand: { type: String, required: true },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    stock: { type: Number, required: true },
    minPrice: { type: Number, required: true },
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
    ],
    ratingAvg: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ name: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ minPrice: 1 });
productSchema.index({ createdAt: 1 });
productSchema.index({ stock: 1 });
// Compound text index for searching
productSchema.index({
  name: "text",
  brand: "text",
  "category.main": "text",
  "category.sub": "text",
});

// Calculate minPrice and stock before saving
productSchema.pre("save", async function (next) {
  const product = this as IProduct;

  if (product.sellers && product.sellers.length > 0) {
    let minPrice = Infinity;
    let totalStock = 0;
  
    // Fetch seller details from the Seller collection
    const sellers = await Seller.find({ _id: { $in: product.sellers } });
  
    sellers.forEach((seller) => {
      seller.products.forEach((productInfo) => {
        if (productInfo.product.toString() === product._id.toString()) {
          if (productInfo.price < minPrice) {
            minPrice = productInfo.price;
          }
          totalStock += productInfo.stock;
        }
      });
    });
  
    product.minPrice = minPrice === Infinity ? 0 : minPrice;
    product.stock = totalStock;
  } else {
    product.minPrice = 0;
    product.stock = 0;
  }
  next();
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
