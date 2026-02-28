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
    const userId=req.user._id;

    /* -------------------- DUPLICATE CHECK -------------------- */
    console.log("Owner : ",userId);
    const existingExpense = await Expense.findOne({
      owner: userId,
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
      owner: userId //🔐 always from token
    });
    const createdExpense=await Expense.findById(expense._id).select("-refreshToken")
    return res.status(201)
    .json(new ApiResponse(201,createdExpense,"expense created successfully"));

  } catch (error) {
    throw new ApiError(500,error.message)
  }
});
//get all expense of user
const getAllExpenses = asyncHandler(async (req, res) => {
  try {
    // Step 1: get logged-in user's id
    const owner=req.user._id;
    if(!owner){
      throw new ApiError(404,"userid is required to fetch expense details");
    }

    // Step 2: fetch expenses belonging to this user
    const expenses = await Expense.find({
      owner,
    }).sort({ date: -1 }); // latest first

    //if check
    if(!owner){
      throw new ApiError(400,"owner is required");
    }
    // Step 3: return response
    return res.status(200)
    .json(new ApiResponse(200,expenses.length,expenses,"expenses of a user fetched successfully"))

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:`unable to fetch expense ${error.message}`,
    });
  }
});
//get Expenses by a id
const getExpenseById=asyncHandler(async(req,res)=>{
try {
    const expenseId=req.params.expenseId;
    const owner=req.user._id;
    console.log("Expense id : ",expenseId),
    console.log("user : ,",owner);
    const expense=await Expense.findOne({
      _id:expenseId,
      owner,
    })
     console.log(expense)
    if(!expense){
      throw new ApiError(404,"expense not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,expense,"expense fetched successfully"));
} catch (error) {
  throw new ApiError(500,error.message);
}
})
//update Expense
const updateExpense=asyncHandler(async(req,res)=>{
try {
    const userId=req.user._id;
    const expenseid=req.params.expenseid
    const allowedUpdates=["amount","date","description","category"];
    const updates={};
    allowedUpdates.forEach((field)=>{
      if(req.body[field] !== undefined){
        updates[field]=req.body[field];
      }
    })
    //console.log(updates);
    if(updates.amount !== undefined && updates.amount<=0){
      throw new ApiError(404,"updated amount must be greater than 0 ");
    }
    //console.log(expenseid);
   // console.log(userId);
    const UpdatedExpense=await Expense.findOneAndUpdate(
      {
        _id:expenseid,
        owner:userId,
      },
      updates,
      {
        new:true,
        runValidators:true,
      }
    )
    //console.log(UpdatedExpense);
    return res.status(200)
    .json(new ApiResponse(200, UpdatedExpense,"expense updated successfully"));
} catch (error) {
  throw new ApiError(500 ,error.message);
}
})
//delete expense
const deleteExpense=asyncHandler(async(req,res)=>{
  const expenseid=req.params.expenseid;
  const owner = req.user._id;
  if(!owner){
    throw new ApiError(400,"give the user whose expense you want to delete");
  }
  const deletedExpense=await Expense.findOneAndDelete(
    {
      _id:expenseid,
      owner,
    }
  )
  return res.status(200)
  .json(new ApiResponse(200,deleteExpense,"Expense successfully deleted by user"));
})
export{createExpense,getAllExpenses,getExpenseById,updateExpense,deleteExpense}