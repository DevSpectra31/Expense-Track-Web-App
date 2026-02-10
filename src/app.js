import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express();

//basic middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

//importing routes
import healthcheckroute from "./routes/healthcheck.route.js";
import UserRoute from "./routes/user.route.js";
import ExpenseRoute from "./routes/expenses.route.js";
//using the routes
app.use("/api/v1/users",healthcheckroute);
app.use("/api/v1/users",UserRoute);
app.use("/api/v1/expenses",ExpenseRoute);
export default app;
