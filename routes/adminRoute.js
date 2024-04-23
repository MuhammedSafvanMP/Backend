import express from "express";
import { createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../middlewares/upload.js";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

// login

router.post("/login", adminLogin);


router.post("/createProducts", uploadImage, createProducts); 

export default router