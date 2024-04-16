import User from "../models/userModel.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password  } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Bad request" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({
            username,
            email,
            password,
            profileImg: req.file.filename, 
        });

        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
