import express from "express";
import { adminViewAllProducts, adminViewProductById, createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../middlewares/upload.js";
import { adminToken } from "../middlewares/adminMiddleware.js";
import { adminLogin, adminViewUserById, allUsers } from "../controllers/adminController.js";

const router = express.Router();

// login
router.post("/login", adminLogin);



// admin routes
// view all users
router.get("/viewAllUsers", adminToken,   allUsers); 
router.get("/user/:id", adminToken,  adminViewUserById); 


// product creating
router.post("/createProducts", adminToken,  uploadImage, createProducts); 
// view all products
router.get("/adminProducts", adminToken, adminViewAllProducts);
// view spesific user
router.get("/adminProducts/:productId", adminToken, adminViewProductById);



export default router