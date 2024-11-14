import mongoose, { Schema, Document, model } from "mongoose";

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
  sellers: {
    seller: string; // Reference to the seller's ID
    price: number;
    stock: number;
  }[];
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
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
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
productSchema.pre("save", function (next) {
  const product = this as IProduct;

  if (product.sellers && product.sellers.length > 0) {
    let minPrice = Infinity;
    let totalStock = 0;
    product.sellers.forEach((seller) => {
      if (seller.price < minPrice) {
        minPrice = seller.price;
      }
      totalStock += seller.stock;
    });
    product.minPrice = minPrice;
    product.stock = totalStock;
  } else {
    product.minPrice = 0;
    product.stock = 0;
  }
  next();
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
