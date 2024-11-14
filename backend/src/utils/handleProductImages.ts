import { Request } from "express";
import { deletePhoto } from "../config/multerConfig";

interface ImgUpdateResult {
  main?: {
    link: string;
    publicId: string;
  };
  sub?: {
    link: string;
    publicId: string;
  }[];
}

export const handleProductImages = async (
  req: Request,
  product: any
): Promise<ImgUpdateResult> => {
  const result: ImgUpdateResult = {};

  const imgs = {
    main: (req.files as any)?.["main"]
      ? {
          link: (req.files as any)?.["main"][0].path,
          publicId: (req.files as any)?.["main"][0].filename,
        }
      : null,
    sub: (req.files as any)?.["sub"]
      ? (req.files as any)?.["sub"].map((file: Express.Multer.File) => ({
          link: file.path,
          publicId: file.filename,
        }))
      : [],
  };

  // Updating main image if provided
  if (imgs.main) {
    if (product.imgs.main) {
      await deletePhoto(product.imgs.main.publicId);
    }
    result.main = imgs.main;
  }

  // Adding new sub-images
  if (imgs.sub.length > 0) {
    result.sub = [...(product.imgs.sub || []), ...imgs.sub];
  }

  // Removing specific sub-images if flagged
  if (req.body.removeSubImages) {
    const removeSubImages = JSON.parse(req.body.removeSubImages);
    for (const publicId of removeSubImages) {
      await deletePhoto(publicId);
    }
    result.sub = (product.imgs.sub || []).filter(
      (img: { publicId: string }) => !removeSubImages.includes(img.publicId)
    );
  }

  return result;
};

export const deleteProductImages = async (product: any): Promise<void> => {
  // Delete main image
  if (product.imgs.main.publicId) {
    await deletePhoto(product.imgs.main.publicId);
  }
  // Delete sub-images
  if (product.imgs.sub && product.imgs.sub.length > 0) {
    for (const subImg of product.imgs.sub) {
      if (subImg.publicId) {
        await deletePhoto(subImg.publicId);
      }
    }
  }
};
