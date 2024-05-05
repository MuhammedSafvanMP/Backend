import User from "../models/userModel.js";
import Products from "../models/productsModel.js";
import Wishlist from "../models/wishlist.js";
import { errorHandler } from "../middlewares/error.js";


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
        if(user.isDeleted == true ) return next(errorHandler(400, "Admin blocked you"));


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


// view user wishlist

export const viewWishlist = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const user = await User.findById(id).populate({
            path: 'wishlist',
            populate: { path: 'productId' }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
         // admin blocking checking
         if(user.isDeleted == true ) return next(errorHandler(400, "Admin blocked you"));

        if (!user.wishlist || user.wishlist.length === 0) {
            return res.status(200).json({ message: "User wishlist is empty", data: [] });
        }

        res.status(200).json(user.wishlist);
    } catch (error) {
        return next(error);
    }
}


// user wishlist remove

export const removeWishlist = async (req, res, next) => {
    try {
        const { userId, itemId } = req.params;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

         // admin blocking checking
         if(user.isDeleted == true ) return next(errorHandler(400, "Admin blocked you"));

        // Find product by ID
        const product = await Products.findById(itemId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Find and delete wishlist item
        const wishlistItem = await Wishlist.findOneAndDelete({ userId: user._id, productId: product._id });
        
        if (!wishlistItem) {
            return res.status(404).json({ message: "Product not found in the user's wishlist" });
        }

        const wishlistItemIndex = user.wishlist.findIndex(item => item.equals (wishlistItem._id));

        // If the wishlist item is found, remove it from the user's wishlist array
        if (wishlistItemIndex !== -1) {
            user.wishlist.splice(wishlistItemIndex, 1);
            await user.save();
        }


        return res.status(200).json({ message: "Product removed from wishlist successfully" });

    } catch (error) {
        return next(error);
    }
};
