import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 7000

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));