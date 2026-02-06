import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/Asynchandler.js";
const VerifyJWT=asyncHandler(async(req,res,next)=>{
   try {
     const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
     if(!token){
         throw new ApiError(401,"token not found");
     }
     const decoded_token=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
     const user=await User.findById(decoded_token._id).select("-password");
     if(!user){
         throw new ApiError(400,"invalid access token")
     }
     req.user=user;
     next();
   } catch (error) {
    throw new ApiError(404,error.message)
   }
})
export{VerifyJWT};