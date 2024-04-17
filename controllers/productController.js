import Products from "../models/productsModel";
import { errorHandler } from "../error/error";

export const allProducts = async (req, res, next) => {
    try {
        Products.find()
        .then((products) => {
            return res.status(200).json({products: products})
        })
        .catch((error) => {
            return next(errorHandler(500, "Unable to get products", error));

        })
    } catch (error) {
        return next(errorHandler(500, "Unable to get products", error));
    }
}