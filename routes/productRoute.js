import express from "express";
import { addToCart, allProducts, decrementCartItemQuantity, incrementCartItemQuantity, productGetId, removeCart, userProductByCategory, viewCart } from "../controllers/productController.js";
import { userToken } from "../middlewares/userMiddleware.js";


const router = express.Router();

// products routes

router.get("/products", userToken, allProducts);
router.get("/products/:id", userToken, productGetId);
router.get("/products/category/:categoryname", userToken, userProductByCategory);

// cart routes

router.post("/:userid/cart/:id", userToken, addToCart);
router.get("/:id/cart", userToken, viewCart);
router.patch("/:userid/cart/:id/increment", userToken, incrementCartItemQuantity);
router.patch("/:userid/cart/:id/decrement", userToken, decrementCartItemQuantity);

router.delete("/:id/cart/:itemId", userToken, removeCart);



// wishlist routes





export default router