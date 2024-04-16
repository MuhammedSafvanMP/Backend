import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import authJoi from "../validation/authJoi.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../error/error.js";

// use sign up

export const signup = async (req, res, next) => {
    try {
        // const { username, email, password } = req.body;

        // // Check if username, email, and password are provided
        // if (!username || !email || !password) {
        //     return res.status(400).json({ message: "Username, email, and password are required" });
        // }

        // Validate request body using Joi
        const result = await authJoi.validateAsync(req.body);

        // Check if email already exists
        const existingUser = await User.findOne({ email: result.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(result.password, 10);

        // Create a new user instance
        const newUser = new User({
            username : result.username,
            email: result.email,
            password: hashedPassword,
            profileImg: req.file ? req.file.filename : null 
        });

        // Save the new user to the database
        await newUser.save();
        
        // Respond with success message
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        // Handle Joi validation errors
        if (error.isJoi === true) {
          
          return res.status(422).json({ message: "Validation Error", details: error.details });
        }
        next(error);

    }
};


// use login

export const login =  async (req, res, next) => {
    try {
        
        const { email, password } = req.body;

          // find in user email in mongodb

        const validUser = await User.findOne({ email })
        if(!validUser)  return next(errorHandler(404, "User not found")); 

        // checking  password
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, "Wrong credentials"));

        // jwt setting
        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET)
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000);

        // cookie setting 
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200).json(rest)



    } catch (error) {
        next(error);
    }
}