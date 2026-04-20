import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "./model/model.js";
import User from "./config/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transactions from "./config/transactions.js";
import cookieParser from "cookie-parser";

const app=express();
app.use(cookieParser());
const jwt_secret="super_secret";
app.use(cors({
  origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.post("/signup",async(req,res)=>{
  const{fname,lname,email}=req.body;
  let {password}=req.body;

    
    const hashpassword=await bcrypt.hash(password,10);
    password=hashpassword;

   const newuser= new User({fname,lname,email,password}) ;
 
 await newuser.save();
 if(newuser)
 res.status(200).json("user was created successfully");
  
})
app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
   const user= await User.findOne({email});
if(!user){
  return res.status(404).send("user not found");

    
}

   const isMatch=await bcrypt.compare(password,user.password);
       if(user&&isMatch){
       const token= jwt.sign({email},jwt_secret,{expiresIn:"1h"});
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      maxAge:360000,
    })
     return res.status(200).json({message:"successfull login",success:true,token:token});}
      else{
        res.status(401).json("unauthorized user");
      }

})
app.post("/transactions",async(req,res)=>{
    const{title,amount,category,date}=req.body;
  
  const token=req.cookies.token;

 const decoded=jwt.verify(token,jwt_secret);
 const loggedInUser=await User.findOne({email:decoded.email});
   const transaction= new transactions({
    title:req.body.title,
    amount:req.body.amount,
    category:req.body.category,
    date:req.body.date,
    user:loggedInUser._id
   });
    await transaction.save();
    return res.status(200).json({message:"successfull saved transactions",success:true});
   
})
const port=3000;
app.listen(port,(req,res)=>{
    console.log("server is ruuning on port",{port});
})
