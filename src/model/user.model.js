import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const UserSchema =new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,
        },
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String,
        }
    },
    {timestamps:true}
);
UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,10);
});
UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(this.password,password);
}
UserSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
};
UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
};
export const User=mongoose.model("User",UserSchema);
