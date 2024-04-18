import express from "express";
import { allProducts, productGetId } from "../controllers/productController.js";


const router = express.Router();


router.get("/products", allProducts);
router.get("/products/:id", productGetId)

export default router