import Connectdb from "./db/index.js";
import  dotenv from "dotenv";
import app from "./app.js";
dotenv.config({path:"./.env"})
const port=process.env.PORT || 3000;
Connectdb().then((result) => {
    app.listen(port,()=>{
        console.log(`App is running on the port ${port}`)
    })
}).catch((err) => {
    console.error("Mongodb connection error : ",err.message)    
});