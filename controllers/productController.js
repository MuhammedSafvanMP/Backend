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
                    $or: [
                        { category: { $regex: new RegExp(categoryname, 'i') } },
                        { title: { $regex: new RegExp(categoryname, 'i') } },
                    ]
                }).select('title category price');
                
                if (products.length === 0) {
                    return res.status(404).json({ message: "No items found in the given category" });
                }
                
                res.status(200).json({ products });
            } catch (error) {
                return next(errorHandler(500, "Unable to get products by category", error));
            }
   
};



