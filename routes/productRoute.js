import express from "express";
import { addToCart, allProducts, productGetId, removeCart, viewCart } from "../controllers/productController.js";
import { userToken } from "../middlewares/userMiddleware.js";


const router = express.Router();


router.get("/products", userToken, allProducts);
router.get("/products/:id", userToken, productGetId);
router.get("/products/category/:categoryname", userToken, (productGetId));


router.post("/:id/cart", userToken, addToCart);
router.get("/:id/cart", userToken, viewCart);
router.delete("/:id/cart/:itemId", userToken, removeCart);





export default router