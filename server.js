import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 7000


// DB connecting
mongoose.connect(process.env.DB)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));