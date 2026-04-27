import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET || "super_secret";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", success: false });
  }
};
