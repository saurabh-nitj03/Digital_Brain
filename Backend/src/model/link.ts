import mongoose, { mongo } from "mongoose";
import User from "./user";

const linkSchema=new mongoose.Schema({
    hash:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
        unique:true,
    }
},{timestamps:true})

const Link=mongoose.model('Link',linkSchema)
export default Link