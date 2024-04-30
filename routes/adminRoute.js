import express from "express";
import { adminDeleteProductById, adminProductByCategory, adminUpdateProducts, adminViewAllProducts, adminViewProductById, createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../middlewares/upload.js";
import { adminToken } from "../middlewares/adminMiddleware.js";
import { adminFindUserName, adminLogin, adminViewUserById, allUsers } from "../controllers/adminController.js";
import { adminOrderDetails, status } from "../controllers/adminOrders.js";

const router = express.Router();

// login
router.post("/login", adminLogin);



// admin routes
// view all users
router.get("/viewAllUsers", adminToken,   allUsers); 
router.get("/user/:id", adminToken,  adminViewUserById); 
router.get("/products/user/:username", adminToken, adminFindUserName);



// product creating
router.post("/createProducts", adminToken,  uploadImage, createProducts); 
// view all products
router.get("/products", adminToken, adminViewAllProducts);
// view spesific user
router.get("/products/:productId", adminToken, adminViewProductById);
// view product category
router.get("/products/category/:categoryname", adminToken, adminProductByCategory);
// edit product by id
router.patch("/products/edit/:productId", adminToken, adminUpdateProducts);
// delete product by id
router.delete("/products/delete/:productId", adminToken, adminDeleteProductById);



// orders routes

// view all orders

router.get('/orders', adminToken, adminOrderDetails);
router.get('/status', adminToken, status);



export default router