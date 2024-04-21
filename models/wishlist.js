import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Corrected reference name to singular form
        required: true,
    },
    quantity: {
        type: Number,
        default: 1 // Default quantity is 1
    }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema); 
export default Wishlist;
