import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();



// admin login

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // email and password checking 

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = Jwt.sign({ email }, process.env.ADMIN_JWT_SECRET);
             // cookie setting 
        res.cookie('access_token', token, { httpOnly: true })
        .status(200).json({ message: "Admin logged in successfully", token })

        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }

    } catch (error) {
        next(error);
    }
};


// list all users


export const allUsers = async (req, res, next) => {
    try {
        
        // find all users in db

        const allusers = await User.find()

        if(allUsers.length === 0){
            return res.status(404).json({message: "No users in database"})
        }

        res.status(200).json(allusers);

    } catch (error) {
        next(error)
    }
}