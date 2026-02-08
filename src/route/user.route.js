import express, { Router } from "express";
import { Signup,Signin,logout,getCurrentUser ,refreshAccessToken,updateAccountDetails} from "../controller/user.controller.js";
import { VerifyJWT } from "../middleware/Auth.middleware.js";
import jwt from "jsonwebtoken";
const app=express.Router();
//routes
app.post("/signup",Signup);
app.post("/login",Signin)
app.post("/logout",VerifyJWT,logout)
app.post("/update",VerifyJWT,updateAccountDetails)
app.get("/currentUser",getCurrentUser)
app.post("/refresh",VerifyJWT,refreshAccessToken)
export default app;
