import transactions from "../models/Transaction.js";
import User from "../models/User.js";
import axios from "axios";
import mongoose from "mongoose";

export const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, date, choice } = req.body;
    const userId = req.user.id;

    let finalCategory = category;

    // Call AI Service to categorize the expense
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/category`, {
        title: title
      }, { timeout: 3000 }); // 3 second timeout for AI service

      if (aiResponse.data && aiResponse.data.category) {
        finalCategory = aiResponse.data.category;
        console.log(`AI Categorized "${title}" as: ${finalCategory}`);
      }
    } catch (aiError) {
      console.error("AI Service Error:", aiError.message);
      // Fallback to user-provided category if AI service is down
      finalCategory = category || "other";
    }

    const transaction = new transactions({
      title,
      amount,
      category: finalCategory,
      date,
      choice: choice || "Expense",
      user: userId,
    });

    await transaction.save();
    return res.status(200).json({
      message: "Successful saved transactions",
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving transaction", error: error.message, success: false });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch paginated transactions
    const paginatedTransactions = await transactions.find({ user: userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalTransactions = await transactions.countDocuments({ user: userId });

    // Calculate total income and expense for the dashboard stats
    const stats = await transactions.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $in: ["$choice", ["Income", "income"]] },
                "$amount",
                0
              ]
            }
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $in: ["$choice", ["Expense", "expense"]] },
                "$amount",
                0
              ]
            }
          }
        }
      }
    ]);

    const totalIncome = stats.length > 0 ? stats[0].totalIncome : 0;
    const totalExpense = stats.length > 0 ? stats[0].totalExpense : 0;

    return res.status(200).json({
      success: true,
      transactions: paginatedTransactions,
      pagination: {
        totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: page,
        limit
      },
      stats: {
        totalIncome,
        totalExpense,
        totalBalance: totalIncome - totalExpense
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message, success: false });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await transactions.findOneAndDelete({ _id: id, user: userId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized", success: false });
    }

    res.status(200).json({ message: "Transaction deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error: error.message, success: false });
  }
};
export const handlereportrequests = async (req, res) => {
  try {
    const url = `${process.env.AI_SERVICE_URL}/download-report?`;
    const user_id = `${req.user.id}`;
    const finalurl = url + "user_id=" + user_id;

    // Use stream to prevent binary corruption
    const airesponse = await axios.get(finalurl, { responseType: "stream" });

    res.setHeader("content-type", "application/pdf");
    const filename = `ExpenseReport_${Date.now()}.pdf`;
    res.setHeader("content-disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF directly to the user
    airesponse.data.pipe(res);
  } catch (error) {
    console.error("Download Error:", error.message);
    res.status(500).json({ message: "Error downloading report" });
  }
}

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, amount, category, date } = req.body;

    const updatedTransaction = await transactions.findOneAndUpdate(
      { _id: id, user: userId },
      { title, amount, category, date },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized", success: false });
    }

    res.status(200).json({ message: "Transaction updated successfully", success: true, transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error: error.message, success: false });
  }
};
