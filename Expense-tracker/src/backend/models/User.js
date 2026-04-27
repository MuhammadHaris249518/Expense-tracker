import mongoose from "mongoose";
import { Schema } from "mongoose";
const Userschema=new Schema(
    {
        fname:{type:String,required:true},
        lname:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true}
        
    }

    

)
const User=mongoose.model("User",Userschema);
export default User;
