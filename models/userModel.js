import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        required: true
    },
    accountCreatedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist"
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
