import express from "express";
import { login, signup } from "../controllers/authController.js";
import upload from "../upload/upload.js";
const router = express.Router();

router.post("/register", upload.single("profileImg"), signup);
router.post("/login", login);


export default router;