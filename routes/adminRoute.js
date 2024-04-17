import express from "express";
import { createProducts } from "../controllers/adminProductsAddController.js";
import uploadProducts from "../upload/uploadProducts.js";

const router = express.Router();

router.post("/createProducts", uploadProducts.single("productImg"), createProducts); 

export default router