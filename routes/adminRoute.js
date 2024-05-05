import express from "express";
import { adminDeleteProductById, adminProductByCategory, adminUpdateProducts, adminViewAllProducts, adminViewProductById, createProducts } from "../controllers/adminProductsAddController.js";
import uploadImage from "../middlewares/upload.js";
import { adminToken } from "../middlewares/adminMiddleware.js";
import { adminBlockUserById,  adminFindUserName, adminLogin, adminUnBlockUserById, adminViewUserById, allUsers } from "../controllers/adminController.js";
import { adminOrderDetails, status } from "../controllers/adminOrders.js";

const router = express.Router();

// login
router.post("/login", adminLogin);



// admin routes
// view all users
router.get("/viewAllUsers", adminToken,   allUsers); 
// view user by id
router.get("/user/:id", adminToken,  adminViewUserById); 
// search user name
router.get("/user/findName/:username", adminToken, adminFindUserName);
// block user
router.delete("/user/block/:userId", adminToken, adminBlockUserById);
// un block user
router.delete("/user/unblock/:userId", adminToken, adminUnBlockUserById);





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
// view all revenue status
router.get('/status', adminToken, status);



export default router