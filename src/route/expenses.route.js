import express from "express";
import { createExpense } from "../controller/expenses.controller.js";
import { VerifyJWT } from "../middleware/Auth.middleware.js";
const app=express.Router();
//expense route
app.post("/create",VerifyJWT,createExpense);



export default app;