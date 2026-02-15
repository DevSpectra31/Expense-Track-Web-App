import {asyncHandler} from "../utils/Asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import cookie from "cookie";
import jwt from "jsonwebtoken"
//generateAccessAndRefreshToken
const generateAccessAndRefreshToken=(async(userId)=>{
   try {
     const user=await User.findById(userId);
     if(!user){
         throw new ApiError(500,"user doesn't exist with this userId")
     }
     const accessToken=user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()
     user.refreshToken=refreshToken;
     await user.save({validateBeforeSave:false})
     return {accessToken,refreshToken};
   } catch (error) {
    throw new ApiError(500,error.message)
   }
})
//Signup
const Signup=asyncHandler(async(req,res)=>{
    try {
        const{username,email,password}=req.body;
        if(!username || !email || !password){
            throw new ApiError(400,"all fileds are required");
        }
        const existedUser=await User.findOne({$or:[{username},{email}]});
        if(existedUser){
            throw new ApiError(400,"user already exist with same email or username")
        }
        const user=await User.create({
            username,
            email,
            password
        })
        const createduser=await User.findById(user._id).select("-password");
        if(!createduser){
            throw new ApiError(500,"failed to create a user");
        }
        return res.status(201).json(new ApiResponse(201,createduser,"User created successfully"));
    } catch (error) {
        throw new ApiError(500,error.message)
    }
})
//loginUser
const Signin=asyncHandler(async(req,res)=>{
   try {
     const {username,password}=req.body;
     if(!username || !password){
         throw new ApiError(400,"username and password is required to login a user")
     }
     const user= await User.findOne({
         username:username
     })
     if(!user){
         throw new ApiError(400,"user doesn't exist")
     }
    //  const isPasswordValid=await user.isPasswordCorrect(password);
    //  if(!isPasswordValid){
    //      throw new ApiError(404,"password is not correct")
    //  }
     const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
     const loggedUser=await User.findById(user._id).select("-password -refreshToken");
     const options={
         httpOnly:true,
         secure:false,
     }
     return res.status(200)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(new ApiResponse(200,
         {
             user:loggedUser,accessToken,refreshToken
         }
     ))
   } catch (error) {
    throw new ApiError(500,error.message)
   }
})
//logoutUser
const logout=asyncHandler(async(req,res)=>{
   try {
     await User.findOneAndUpdate(
        req.user._id,
        {
         $unset:{refreshtoken:1}
     },{
         new:true,
     }
    );
     const options={
         httpOnly:true,
         secure:false,
     }
     const user=await User.findById(req.user._id).select("-password -refreshToken")
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,user,"user logout successfully"))
   } catch (error) {
    throw new ApiError(400,error.message)
   }
})
//update account details
const updateAccountDetails=asyncHandler(async(req,res)=>{
    try {
        const {username,email,newusername,newemail}=req.body;
        if( !username || !email || !newusername || !newemail){
            throw new ApiError(400,"all fileds are  required to update account detils");
        }
        const user=await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    username:newusername,
                    email:newemail,
                }
            },
            {new:true}
        ).select("-password -refreshToken")
        return res.status(200)
        .json(new ApiResponse(201,user,"user account details get updated"));
    } catch (error) {
        throw new ApiError(500,error.message);
    }
})
//get Current user
const getCurrentUser=asyncHandler(async(req,res)=>{
    try {
        const {username}=req.body;
        const user=await User.findOne({username}).select("-password -refreshToken");
        if(!user){
            throw new ApiError(400,"user cannot be found with provided username")
        }
        return res.status(201)
        .json(new ApiResponse(201,user,"user detials fetched successfully"));
    } catch (error) {
        throw new ApiError(500,error.message)
    }
})

//refresh Access Token
const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingrefreshToken=req.cookies?.refreshToken || req.body?.refreshToken;
        console.log("Access Token : ",incomingrefreshToken)
        if(!incomingrefreshToken){
            throw new ApiError(400,"unauthorized request")
        }
        const decodedToken=jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken._id).select("-password ");
        if(!user){
            throw new ApiError(400,"token is invalid")
        }
        if(incomingrefreshToken !== user?.refreshToken){
            throw new ApiError(400,"token is already used or expired")
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        const options={
            httpOnly:true,
            secure:false,
        }
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{user,accessToken,refreshToken},"New refreshToken generated successfully"));
    } catch (error) {
        throw new ApiError(500,error.message)
    }
})
export{Signup,Signin,logout,getCurrentUser,updateAccountDetails,refreshAccessToken}