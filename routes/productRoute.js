import express from "express";
import { allProducts } from "../controllers/productController.js";


const router = express.Router();


router.get("/products", allProducts);

export default router