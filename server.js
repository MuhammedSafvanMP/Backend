import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 7000

// middlewares
// users
app.use("/api/users", authRoute);
app.use("/api/users", productRoute);
// admin
app.use("/api/admin", adminRoute);


// custom middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})


// DB connecting
mongoose.connect(process.env.DB)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));