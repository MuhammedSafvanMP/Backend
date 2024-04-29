import mongoose from "mongoose";



const ordersSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", 
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    orderTime: {
        type: String,
        required: true,
        default: new Date().toTimeString()
    },
    orderId: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
        required: true
    }
    
})

const Orders = mongoose.model("Orders", ordersSchema);
export default Orders;