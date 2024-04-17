import Products from "../models/productsModel";
import { errorHandler } from "../error/error";
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
