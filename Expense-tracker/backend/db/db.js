import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MyNewDatabase";

mongoose.connect(uri)
.then(()=>console.log("database connected"))
.catch((err)=>console.log("not connected", err));
