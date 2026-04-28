import express from "express";
import cors from "cors";
import helmet from "helmet"; // IMPORT HELMET
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Apply Helmet security headers globally
app.use(helmet());

app.use(cookieParser());
// Whitelist specific origins (e.g., your local Vite dev server and your production domain)
const allowedOrigins = [
  "http://localhost:5173", // Replace this if your frontend runs on a different port locally
  process.env.ORIGIN // Your production frontend URL defined in .env
].filter(Boolean); // Removes undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) OR exact allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Added payload size limit to prevent Denial of Service (DoS) attacks
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
