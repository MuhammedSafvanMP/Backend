import express from "express";
import { addToCart, allProducts, productGetId, removeCart, updateCartItemQuantity, viewCart } from "../controllers/productController.js";
import { userToken } from "../middlewares/userMiddleware.js";


const router = express.Router();

// products routes

router.get("/products", userToken, allProducts);
router.get("/products/:id", userToken, productGetId);
router.get("/products/category/:categoryname", userToken, (productGetId));

// cart routes

router.post("/:id/cart", userToken, addToCart);
router.get("/:id/cart", userToken, viewCart);
router.get("/:id/cart", userToken, updateCartItemQuantity);
router.delete("/:id/cart/:itemId", userToken, removeCart);



// wishlist routes





export default router