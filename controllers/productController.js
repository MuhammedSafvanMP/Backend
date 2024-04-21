import Products from "../models/productsModel.js";
import { errorHandler } from "../middlewares/error.js";
import User from "../models/userModel.js";
import Cart from "../models/cart.js";
import Wishlist from "../models/wishlist.js";

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

// Add to cart

export const addToCart = async (req, res, next) => {   
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
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

        // create a cart
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });

        if (cartItem) {
            // If the product already exists, increment the quantity
            cartItem.quantity++;
            await cartItem.save();
        } else {
            // If the product doesn't exist, create a new cart item
            cartItem = await Cart.create({
                userId: user._id,
                productId: product._id,
                quantity: 1
            });
        }

        // Add product to user's cart
        user.cart.push(cartItem._id);
        await user.save();



        
        // Add product to user's cart
        // user.cart.push(toCart._id); // Push the product ID directly
        // await user.save();

        return res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        // Handle any errors
        return next(error);
    }
};


// view  product from cart    


export const viewCart = async (req, res, next) => {
    try {
        const {id} = req.params; 
        const user = await User.findById(id).populate({
            path: 'cart',
            populate: { path: 'productId'}
        });

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(!user.cart || user.cart.length === 0){
            return res.status(200).json({message: "User cart is empty", data: []});
        }

        res.status(200).json(user.cart);

    } catch (error) {
       return next(error);
    }
}

// Add cart quantity

export const incrementCartItemQuantity = async (req, res, next) => {
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        const  {quantityIncrement}  = req.body;  


        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart item
        console.log("Finding Cart Item");
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });
        console.log("Cart Item:", cartItem);
        if (cartItem) {
            // If the product already exists, increment the quantity
            if(typeof quantityIncrement !== "number"){
                return res.status(400).json({message: "Bad request"})
            }else{
                cartItem.quantity += quantityIncrement;
                console.log("Updated Cart Item:", cartItem);
                await cartItem.save();

            }
        }

        res.status(201).json({ message: "Quantity incremented" });

    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
};


export const decrementCartItemQuantity = async (req, res, next) => {
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        const  {quantityDecrement}  = req.body;  


        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart item
        console.log("Finding Cart Item");
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });
        console.log("Cart Item:", cartItem);
        if (cartItem) {
            // If the product already exists, decrement the quantity
            if(typeof quantityDecrement !== "number"){
                return res.status(400).json({message: "Bad request"})
            }else{
                cartItem.quantity -= quantityDecrement;
                console.log("Updated Cart Item:", cartItem);
                await cartItem.save();

            }
            
        }
        res.status(201).json({ message: "Quantity decremented" });

    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
};

// Remove A cart 


export const removeCart = async (req, res, next) => {
    try {
        const { userId, itemId } = req.params;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(itemId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Find and delete cart item
        const cartItem = await Cart.findOneAndDelete({ userId: user._id, productId: product._id });

        if (!cartItem) {
            return res.status(400).json({ message: "Product not found in the user's cart" });
        }

        return res.status(200).json({ message: "Product removed successfully" });

    } catch (error) {
        return next(error);
    }
};


// Add to cart  wishlist

export const addToWishlist = async (req, res, next) => {   
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        
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

        // Check if the product is already in the wishlist
        let wishlistItem = await Wishlist.findOne({ userId: user._id, productId: product._id });
        if (wishlistItem) {
            return res.status(400).json({ message: "Product already exists in the wishlist" });
        }

        // Create a new wishlist item
        wishlistItem = await Wishlist.create({
            userId: user._id,
            productId: product._id,
            quantity: 1
        });

        // Add product to user's wishlist
        user.wishlist.push(wishlistItem._id);
        await user.save();

        return res.status(200).json({ message: "Product added to wishlist successfully" });
    } catch (error) {
        // Handle any errors
        return next(error);
    }
};
