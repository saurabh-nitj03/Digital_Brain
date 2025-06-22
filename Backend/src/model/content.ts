import mongoose from "mongoose";
import User from "./user";

// const contentTypes = ['image', 'video', 'article', 'audio'];
const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['youtube', 'twitter', 'document', 'image', 'link'],
        required: true
    },
    link: {
        type: String,
    },
    content: {
        type: String,
    },
    tags:[
      {  type:String}
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
},{timestamps:true})

const Content = mongoose.model('Content', contentSchema);
export default Content

