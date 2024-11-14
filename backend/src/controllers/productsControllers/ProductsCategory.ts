import { Request, Response } from "express";
import Category, { ICategory } from "../../models/productModals/Category.Model";

// Get all categories with subcategories structured
export const getStructuredCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().populate("subcategories");

    // Function to structure categories
    const structureCategories = (cats: any) => {
      const map = new Map();
      const result: ICategory[] = [];

      cats.forEach((cat: any) => {
        if (!cat.subcategories) {
          cat.subcategories = [];
        }
        map.set(cat._id.toString(), cat);
      });

      cats.forEach((cat: any) => {
        if (cat.subcategories.length > 0) {
          cat.subcategories.forEach((sub: any) => {
            const subCat = map.get(sub.toString());
            if (subCat) {
              cat.subcategories.push(subCat);
              map.delete(sub.toString());
            }
          });
        }
      });

      map.forEach((value) => result.push(value));

      return result;
    };

    const structuredCategories = structureCategories(categories);
    res.status(200).json(structuredCategories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};
