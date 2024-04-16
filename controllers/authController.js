import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import authJoi from "../validation/authJoi.js";
import jwt from "jsonwebtoken";

// use sign up

export const signup = async (req, res) => {
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
            error.status = 422;
        }
        
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// use login

export const login =  async (req, res) => {
    try {
        
        const { email, password } = req.body;

          // find in user email in mongodb

        const validUser = await User.findOne({ email })
        if(!validUser)  return res.status(404).json({ message: "User not found" })  

        // checking  password
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return res.status(401).json({ message: "Wrong credentials" }) 

        // jwt setting
        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET)
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000);

        // cookie setting 
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200).json(rest)



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}