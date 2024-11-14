import express from "express";
import * as productController from "../controllers/productsControllers/products.controller";
import { uploadProductPhoto } from "../config/multerConfig";
import { checkProductId, cacheProduct } from "../middlewares/product.middlware";
import { withRedisClient } from "../middlewares/redisMiddleware";

const router = express.Router();

router
  .route("/products")
  .get(productController.getProducts)
  .post(
    uploadProductPhoto.fields([
      { name: "main", maxCount: 1 },
      { name: "sub", maxCount: 5 },
    ]),
    productController.createProduct
  );

router
  .route("/products/:id")
  .get(
    withRedisClient,
    checkProductId,
    cacheProduct,
    productController.getProduct
  )
  .put(
    withRedisClient,
    checkProductId,

    uploadProductPhoto.fields([
      { name: "main", maxCount: 1 },
      { name: "sub", maxCount: 5 },
    ]),
    productController.updateProduct
  )
  .delete(withRedisClient, checkProductId, productController.deleteProduct);

export default router;
