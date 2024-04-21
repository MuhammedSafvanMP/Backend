import express from "express";
import { addToCart, addToWishlist, allProducts, decrementCartItemQuantity, incrementCartItemQuantity, productGetId, removeCart, removeWishlist, userProductByCategory, viewCart, viewWishlist } from "../controllers/productController.js";
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
router.delete("/:userId/cart/:itemId/remove", userToken, removeCart);



// wishlist routes

router.post("/:userid/wishlist/:id", userToken, addToWishlist);
router.get("/:id/wishlist", userToken, viewWishlist);
router.delete("/:userId/wishlist/:itemId/remove", userToken, removeWishlist);






export default router