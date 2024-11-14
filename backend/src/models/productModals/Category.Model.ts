import mongoose, { Schema, Document, model } from "mongoose";

// Define the interface for a category
export interface ICategory extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  subcategories: mongoose.Schema.Types.ObjectId[]; // References to subcategories
}

// Define the schema for a category
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
