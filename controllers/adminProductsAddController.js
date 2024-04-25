import Products from "../models/productsModel.js";
import porductJoi from "../validation/productJoi.js";


// create products

export const createProducts = async (req, res, next) => {
    try {
        // Manual validation (optional but recommended)
        // const { title, description, price, category } = req.body;
        // if (!title || !description || !price || !category) {
        //     return res.status(400).json({ message: "Bad request" });
        // }

        // Validate request body using Joi
        
        const result = await porductJoi.validateAsync(req.body);

        const newProduct = new Products({
            title: result.title,
            description: result.description,
            price: result.price,
            category: result.category,
            productImg: req.cloudinaryImageUrl //req.file ? req.file.filename : null,
        });

        await newProduct.save();
        return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        if (error.isJoi === true) {
            return res.status(422).json({ message: "Validation Error", details: error.details });
        } else {
            // Handle other types of errors
          return  next(error)
        }
    }
};


// view all products 

export const  adminViewAllProducts = async (req, res, next) => {
    try {
        const allProcucts = await Products.find();

        if(!allProcucts){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json(allProcucts);
    } catch (error) {
        next(error);
    }
}
