
import express from "express";
import {
  registerUser,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

// Student Registration
router.post("/register", registerUser);

// Student/Admin Login
router.post("/login", loginUser);

export default router;
