import Products from "../models/productsModel.js";
import { errorHandler } from "../error/error.js";
import jwt from "jsonwebtoken";

export const allProducts = async (req, res, next) => {
    try {

        // Check if the request contains a JWT token

        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            // Token is valid, user is authenticated
            
            Products.find()
                .then((products) => {
                    return res.status(200).json({ products });
                })
                .catch((error) => {
                    return next(errorHandler(500, "Unable to get products", error));
                });
        });

    } catch (error) {
        return next(errorHandler(500, "Unable to get products", error));
    }
};

// show product by Id

export const productGetId = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Check if the request contains a JWT token
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            // Token is valid, user is authenticated
            
            try {
                // Find the product by ID
                const findProduct = await Products.findById(id);
                
                if (!findProduct) {
                    return res.status(404).json({ message: "Product not found" });
                }
                
                res.status(200).json({ product: findProduct });
            } catch (error) {
                return next(errorHandler(500, "Unable to get product", error));
            }
        });
    } catch (error) {
        return next(errorHandler(500, "Unable to get product", error));
    }
};


//  show products by category

export const userProductByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        
        // Check if the request contains a JWT token
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            // Token is valid, user is authenticated
            
            try {
                // Find products by category
                const products = await Products.find({
                    category: { $regex: new RegExp(categoryName, "i") }
                });
                
                if (products.length === 0) {
                    return res.status(404).json({ message: "No items found in the given category" });
                }
                
                res.status(200).json({ products });
            } catch (error) {
                return next(errorHandler(500, "Unable to get products by category", error));
            }
        });
    } catch (error) {
        return next(errorHandler(500, "Unable to get products by category", error));
    }
};