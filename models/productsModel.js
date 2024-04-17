import  mongoose from "mongoose";

// products schema creating

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
        requrired: true
    },
    productImg: {
        type: String,
        required:  true
    },
    category: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: false
    }
})

const Products = mongoose.model("Products", productSchema);

export default Products;
