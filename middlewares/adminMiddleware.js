import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const adminToken =  (req, res, next) => {
    try {
        const token = req.headers["authorization"];
       
        if (!token) {
            return res.status(403).json({ message: "Token is not provided" });
        }

        Jwt.verify(token, process.env.USER_JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.email = decode.email
            next();
        });
    } catch (error) {
        return next(error);
    }
};
