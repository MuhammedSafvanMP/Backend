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


// view  product from cart


export const viewCart = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate("cart.productsId")

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        if(!user.cart || user.cart.length === 0){
            return res.status(200).json({message: "User cart is empty", data: []})
        }
        res.status(200).json(user.cart)

    } catch (error) {
       return next(error)        
    }
}

// Add cart quantity

export const updateCartItemQuantity = async (req, res, next)  => {
    try {
        const userId = req.params.userId;
        const { id, quantityChange } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const cartItem = user.cart.id(id);
        if (!cartItem) {
            return res.status(404).json({message: "Cart item not found"});
        }

        if (typeof quantityChange !== 'number' || isNaN(quantityChange)) {
            return res.status(400).json({message: "Invalid quantity change"});
        }

        cartItem.quantity += quantityChange;

        if (cartItem.quantity > 0) {
            await user.save();
            return res.status(200).json({message: "Cart item quantity updated"});
        } else {
            // // If quantity becomes zero or negative, remove the item from the cart
            // user.cart.pull(id);
            await user.save();
            return res.status(200).json({message: "Cart item removed"});
        }
        
    } catch (error) {
        return next(error);   
    }
}

// Remove A cart 


export const removeCart = async (req, res, next) =>{
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        if(!productId){
            return res.status(400).json({message: "Product ID not provided"});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {$pull: {cart: productId}}, {new: true});

        if(!updatedUser){
            return res.status(400).json({message: "Product not found in the user's cart"});
        }

        return res.status(200).json({message: "Product removed successfully"});

    } catch (error) {
        return next(error);
    }
}
