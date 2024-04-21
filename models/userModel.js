import mongoose from "mongoose";

// creating user schema

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
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart"
    }],
    whishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Whishlist"
    }]

}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;
