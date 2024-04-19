import express from "express";
import { login, signup } from "../controllers/authController.js";
import uploadImage from "../middlewares/upload.js";
const router = express.Router();

router.post("/register",  uploadImage, signup);
router.post("/login", login);


export default router;