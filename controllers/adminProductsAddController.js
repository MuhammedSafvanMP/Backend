import Products from "../models/productsModel.js";
import productJoi from "../validation/productJoi.js";


// create products

export const createProducts = async (req, res, next) => {
    try {
        // Manual validation (optional but recommended)
        // const { title, description, price, category } = req.body;
        // if (!title || !description || !price || !category) {
        //     return res.status(400).json({ message: "Bad request" });
        // }

        // Validate request body using Joi
        
        const result = await productJoi.validateAsync(req.body);

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


// view product by id 


export const adminViewProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const findProduct = await Products.findById(productId);
        if(!findProduct){
            return res.status(404).json({message: "Product not found"})
        }
        res.status(200).json(findProduct);
    } catch (error) {
        return next(error);
    }
}


// view product by category 


export const adminProductByCategory = async (req, res, next) => {                                                                                            

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
            return next(errorHandler(404, "Unable to get products by category", error));
        }

};


// update products

export const adminUpdateProducts = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const findProduct = await Products.findById(productId);

        if (!findProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

       const { title, description, price, category } = req.body;

        // Update the product properties if they exist in the request body
        if (title) findProduct.title = title;
        if (description) findProduct.description = description;
        if (price) findProduct.price = price;
        if (req.cloudinaryImageUrl) findProduct.productImg = req.cloudinaryImageUrl;
        if (category) findProduct.category = category;

        // Save the updated product
        await findProduct.save();

        res.status(200).json({ message: "Product successfully updated" });

    } catch (error) {
        return next(error);
    }
}




// delete product

export const adminDeleteProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const productDelete = await Products.findByIdAndDelete(productId);

        if (!productDelete) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        return next(error);
    }
}
