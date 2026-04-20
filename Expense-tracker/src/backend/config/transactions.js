import mongoose from "mongoose";

const trashema=new mongoose.Schema({
    user:{ref:"User",type:mongoose.Schema.Types.ObjectId,required:true},
title:{type:String,required:true},

amount:{type:Number,required:true},
category:{type:String,required:true},
date:{type:Date,required:true},
}

)
const transactions=mongoose.model("transactions",trashema);
export default transactions;