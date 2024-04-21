import mongoose from "mongoose";

// Products schema creation
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true 
    },
    productImg: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity:{type :Number, default:1},
    isDeleted: {
        type: Boolean,
        required: false
    }
});

const Products = mongoose.model("Products", productSchema);

export default Products;
