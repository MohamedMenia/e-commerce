import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const getStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpg", "png"],
    } as any,
  });
export const uploadUserPhoto = multer({ storage: getStorage("user_photos") });
export const uploadProductPhoto = multer({
  storage: getStorage("product_photos"),
});

export const deletePhoto = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};
