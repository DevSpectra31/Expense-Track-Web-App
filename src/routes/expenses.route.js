import express from "express";
import { createExpense,getAllExpenses ,getExpenseById} from "../controller/expenses.controller.js";
import { VerifyJWT } from "../middleware/Auth.middleware.js";
const app=express.Router();
//expense route
app.post("/create",VerifyJWT,createExpense);
app.get("/getExpenses",VerifyJWT,getAllExpenses);
app.get("/getExpensebyid",VerifyJWT,getExpenseById)
export default app;