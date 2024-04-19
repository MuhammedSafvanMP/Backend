import express from "express";
import { allProducts, productGetId } from "../controllers/productController.js";
import { userToken } from "../middlewares/userMiddleware.js";


const router = express.Router();


router.get("/products", userToken, (allProducts));
router.get("/products/:id", userToken, productGetId);

export default router