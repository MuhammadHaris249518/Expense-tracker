import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod"; // IMPORT ZOD

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}
const jwt_secret = process.env.JWT_SECRET;

// Define Schemas for Validation
const signupSchema = z.object({
  fname: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lname: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  email: z.string().trim().email("Invalid email format").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(64)
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export const signup = async (req, res) => {
  try {
    // 1. VALIDATE INCOMING DATA FIRST
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Invalid input data", 
        errors: validation.error.errors, 
        success: false 
      });
    }

    // 2. USE CLEAN, VALIDATED DATA
    const { fname, lname, email, password } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new User({ fname, lname, email, password: hashpassword });

    await newuser.save();
    res.status(200).json({ message: "User was created successfully", success: true });
  } catch (error) {
    // HIDE SENSITIVE ERROR MESSAGES
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error during signup", success: false });
  }
};

export const login = async (req, res) => {
  try {
    // 1. VALIDATE INCOMING DATA FIRST
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Invalid input data", 
        errors: validation.error.errors, 
        success: false 
      });
    }

    // 2. USE CLEAN, VALIDATED DATA
    const { email, password } = validation.data;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const token = jwt.sign({ email: user.email, id: user._id }, jwt_secret, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true, // Cannot be accessed by bad JavaScript (prevents XSS)
        secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Prevents Cross-Site Request Forgery (CSRF)
        maxAge: 3600000, // 1 hour
      });
      return res.status(200).json({ message: "Successful login", success: true, token });
    } else {
      res.status(401).json({ message: "Unauthorized user", success: false });
    }
  } catch (error) {
    // HIDE SENSITIVE ERROR MESSAGES
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login", success: false });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully", success: true });
};
