import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Define a strict rate limit for login attempts (Brute Force Protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 5 requests per window
  message: { message: "Too many login attempts from this IP, please try again after 15 minutes", success: false }
});

// Define a rate limit for account creation (Spam Protection)
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // Limit each IP to 5 signups per hour to prevent fake account flooding
  message: { message: "Too many accounts created from this IP, please try again after an hour", success: false }
});

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

export default router;
