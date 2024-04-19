import Products from "../models/productsModel.js";
import { errorHandler } from "../middlewares/error.js";
import User from "../models/userModel.js";


// show all products

export const allProducts = async (req, res, next) => {
    try {
            Products.find()
                .then((products) => {
                    return res.status(200).json({ products });
                })
                .catch((error) => {
                    return next(errorHandler(404, "Unable to get products", error));
                });
        

    } catch (error) {
        return next(errorHandler(404, "Unable to get products", error));
    }
};

// show product by Id

export const productGetId = async (req, res, next) => {
    try {
        const { id } = req.params;
            try {
                // Find the product by ID
                const findProduct = await Products.findById(id);
                
                if (!findProduct) {
                    return res.status(404).json({ message: "Product not found" });
                }
                
                res.status(200).json({ product: findProduct });
            } catch (error) {
                return next(errorHandler(404, "Unable to get product", error));
            }
    } catch (error) {
        return next(errorHandler(404, "Unable to get product", error));
    }
};


//  show products by category

export const userProductByCategory = async (req, res, next) => {

        try {
            const { categoryname } = req.params;
                // Find products by category
                const products = await Products.find({
                    category: { $regex: new RegExp(categoryname, "i") }
                });
                
                if (products.length === 0) {
                    return res.status(404).json({ message: "No items found in the given category" });
                }
                
                res.status(200).json({ products });
            } catch (error) {
                return next(errorHandler(500, "Unable to get products by category", error));
            }
   
};

// Add to cart

export const addToCart = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in the cart
        const isProductInCart = user.cart.some(item => item.productId.toString() === productId);
        if (isProductInCart) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        // Add product to user's cart
        user.cart.push({ productId: productId, quantity: 1 });
        await user.save();

        return res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        // Handle any errors
        return next(error);
    }
};
