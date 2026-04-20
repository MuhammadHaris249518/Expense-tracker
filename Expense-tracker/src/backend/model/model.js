import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/MyNewDatabase")
.then(()=>console.log("database connected"))
.catch("not connected");
