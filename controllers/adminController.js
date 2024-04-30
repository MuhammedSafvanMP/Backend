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


// view user by Id

export const adminViewUserById = async (req, res, next) => {
    try {
        const { id } = req.params;


        // fiding user in DB
        const findOneUser = await User.findById(id);

        if(!findOneUser){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(findOneUser);

    } catch (error) {
        return next(error);
    }
}


//  show user by Name

export const adminFindUserName = async (req, res, next) => {                                                                                            
    try {
        const { username } = req.params;
        // Find users by username containing the category name
        const users = await User.find({ username: { $regex: new RegExp(username, 'i') } }).select('username');
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found with usernames containing the given category name" });
        }
        
        res.status(200).json({ users });
    } catch (error) {
        return next(errorHandler(404, "Unable to get users by category", error));
    }
};
