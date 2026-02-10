import { Expense } from "../model/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { User } from "../model/user.model.js";
const createExpense = asyncHandler(async (req, res) => {
  try {
    const { amount, category, description, date ,owner} = req.body;

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
      date, 
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
      owner: req.user._id // 🔐 always from token
    });
    const createdExpense=await Expense.findById(expense._id).select("-refreshToken")
    return res.status(201)
    .json(new ApiResponse(201,createdExpense,"expense created successfully"));

  } catch (error) {
    throw new ApiError(500,error.message)
  }
});
//get all expense of user
const getAllExpenses = async (req, res) => {
  try {
    // Step 1: get logged-in user's id
    const userId = req.user._id;

    // Step 2: fetch expenses belonging to this user
    const expenses = await Expense.find({
      owner: userId,
    }).sort({ date: -1 }); // latest first

    // Step 3: return response
    return res.status(200).json({
      count: expenses.length,
      expenses,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
};

export{createExpense,getAllExpenses}