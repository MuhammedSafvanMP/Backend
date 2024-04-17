
import Products from "../models/productsModel.js";

export const createProducts = async (req, res, next) => {
    try {
        const { title, description, price, category } = req.body;

        // Check if required fields are provided
        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "Bad request" });
        }

        const newProduct = new Products({
            title,
            description,
            price,
            category,
            productImg: req.file ? req.file.filename : null 
        });

        await newProduct.save();
        return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        console.log(error)
        next(error);
    }
};