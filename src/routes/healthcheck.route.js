import express, { Router } from "express";
const app=express.Router();
app.get("/healthcheck",(req,res)=>{
    res.send(`Expense Tracker API is running`)
})
export default  app;