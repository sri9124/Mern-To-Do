import { text } from "express";
import mongoose, { Schema } from "mongoose";

const todoSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true 
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completed:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Todo=mongoose.model("Todo",todoSchema)

export default Todo