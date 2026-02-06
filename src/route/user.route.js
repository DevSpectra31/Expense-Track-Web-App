import express, { Router } from "express";
import { Signup,Signin,logout,getCurrentUser ,refreshAccessToken} from "../controller/user.controller.js";
import { VerifyJWT } from "../middleware/Auth.middleware.js";
const app=express.Router();
//routes
app.post("/signup",Signup);
app.post("/login",Signin)
app.post("/logout",VerifyJWT,logout)
app.get("/currentUser",getCurrentUser)
app.post("/refresh",VerifyJWT,refreshAccessToken)
export default app;
