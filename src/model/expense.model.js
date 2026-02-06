import { stringifyCookie } from "cookie";
import mongoose ,{Schema} from "mongoose";
const ExpenseSchema=new Schema(
    {
        amount:{
            type:Number,
            required:true,
            min:1,
        },
        description:{
            type:String,
            trim:true,
            required:false,
        },
        category:{
            type:String,
            enum:["Food","Bill","Travel","Education","HealthCare","Other"],
            required:true,
        },
        date:{
            type:Date,
            default:Date.now()
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    },
    {timestamps:true}
)
export const Expense=mongoose.model("Expense",ExpenseSchema);