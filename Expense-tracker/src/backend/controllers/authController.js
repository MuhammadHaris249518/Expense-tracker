import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}
const jwt_secret = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new User({ fname, lname, email, password: hashpassword });

    await newuser.save();
    res.status(200).json({ message: "User was created successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const token = jwt.sign({ email: user.email, id: user._id }, jwt_secret, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      });
      return res.status(200).json({ message: "Successful login", success: true, token });
    } else {
      res.status(401).json({ message: "Unauthorized user", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in login", error: error.message, success: false });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully", success: true });
};
