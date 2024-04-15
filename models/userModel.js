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
    profileimg: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    isDeleted: {
        required: false,
    }

}, {timestamps: true})

const User = mongoose.models("User", userSchema);
export default User;