import mongoose from "mongoose";
const Connectdb=async()=>{
   try {
     const InstanceConnection=await mongoose.connect(process.env.MONGO_URI,{
         dbName:"Expense_tracker",
     })
     console.log(`Mongodb got connected Db host ! ${InstanceConnection.connection.host}`)
   } catch (error) {
    console.error("Mongodb connection error : ",error.message);
    process.exit(1);
   }
}
export default Connectdb;