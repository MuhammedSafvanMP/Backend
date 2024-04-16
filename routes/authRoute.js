import express from "express";
import { signup } from "../controllers/authController.js";
import upload from "../upload/upload.js";
const router = express.Router();

router.post("/register", upload.single("image"), signup)


export default router;