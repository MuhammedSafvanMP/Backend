import express from "express";
import { createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../upload/upload.js";

const router = express.Router();

router.post("/createProducts", uploadImage, createProducts); 

export default router