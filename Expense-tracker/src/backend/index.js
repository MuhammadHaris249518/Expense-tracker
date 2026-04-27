import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin during development, or fallback to exact string if provided
    if (!origin || origin.startsWith("http://localhost:") || origin === process.env.ORIGIN) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
