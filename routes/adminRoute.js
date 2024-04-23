import express from "express";
import { createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../middlewares/upload.js";
import { adminToken } from "../middlewares/adminMiddleware.js";
import { adminLogin, allUsers } from "../controllers/adminController.js";

const router = express.Router();

// login
router.post("/login", adminLogin);



// admin routes
// view all users
router.get("/viewAllUsers", adminToken,  uploadImage, allUsers); 
router.post("/createProducts", adminToken,  uploadImage, createProducts); 


export default router