import express from "express";
import { handlereportrequests } from "../controllers/transactionController.js";
import { addTransaction, getTransactions, deleteTransaction, updateTransaction } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/download", verifyToken, handlereportrequests)
router.post("/", verifyToken, addTransaction);
router.get("/", verifyToken, getTransactions);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;
