import { Expense } from "../model/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/Asynchandler.js";
const createExpense = asyncHandler(async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    /* -------------------- BASIC VALIDATION -------------------- */
    if (!amount || amount <= 0) {
        throw new ApiError(400,"amount must be greater than 0 . ")
    }
    if (!category) {
        throw new ApiError(400,"category is required")
    }

    /* -------------------- DATE NORMALIZATION -------------------- */
    // If date not provided, use today
    const expenseDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(expenseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(expenseDate);
    endOfDay.setHours(23, 59, 59, 999);

    /* -------------------- DUPLICATE CHECK -------------------- */
    const existingExpense = await Expense.findOne({
      owner: req.user._id,
      amount,
      category,
      date, //{ $gte: startOfDay, $lte: endOfDay },
    });

    if (existingExpense) {
        throw new ApiError(400,"expense already exist")
    }

    /* -------------------- CREATE EXPENSE -------------------- */
    const expense = await Expense.create({
      amount,
      category,
      description,
      date: expenseDate,
      owner: req.user._id, // 🔐 always from token
    });
    const createdExpense=await Expense.findById(expense._id).select("-refreshToken")
    return res.status(201)
    .json(new ApiResponse(201,createdExpense,"expense created successfully"));

  } catch (error) {
    throw new ApiError(500,error.message)
  }
});
export{createExpense}