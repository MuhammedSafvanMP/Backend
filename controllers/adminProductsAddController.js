
import Products from "../models/productsModel.js";
import porductJoi from "../validation/productJoi.js";

export const createProducts = async (req, res, next) => {
    try {
        // const { title, description, price, category } = req.body;

        // Check if required fields are provided
        // if (!title || !description || !price || !category) {
        //     return res.status(400).json({ message: "Bad request" });
        // }
        
        // validate request body using Joi
        const result = await porductJoi.validateAsync(req.body)

        const newProduct = new Products({
            title: result.title,
            description: result.description,
            price: result.price,
            category: result.category,
            productImg: req.file ? req.file.filename : null 
        });

        await newProduct.save();
        return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        // Handle Joi validation errors
        if (error.isJoi === true) {
            return res.status(422).json({ message: "Validation Error", details: error.details });
          }
        next(error);
    }
};