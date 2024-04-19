import express from "express";
import { addToCart, allProducts, productGetId } from "../controllers/productController.js";
import { userToken } from "../middlewares/userMiddleware.js";


const router = express.Router();


router.get("/products", userToken, allProducts);
router.get("/products/:id", userToken, productGetId);
router.get("/products/category/:categoryname", userToken, (productGetId));


router.get("/:id/cart", userToken, addToCart);



export default router