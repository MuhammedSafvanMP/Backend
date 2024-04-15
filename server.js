import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 7000

// middlewares
app.use("/api/users", authRoute);


// DB connecting
mongoose.connect(process.env.DB)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));