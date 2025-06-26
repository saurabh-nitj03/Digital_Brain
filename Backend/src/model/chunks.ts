import mongoose from "mongoose";

const chunkSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chunktext:{
        type:String,
        required:true
    },
    embedding:{
        type:Array,
        required:true
    },
    source:{
        type:String,
        default:"Unknown"
    },
    contentType:{
        type:String,
        enum:['pdf', 'image', 'web', 'youtube', 'twitter', 'text'],
        default:'text'
    },
    metadata:{
        originalFileName: String,
        url: String,
        pageNumber: Number,
        confidence: Number
    }
},{timestamps:true})

// Create a vector search index for the embedding field
chunkSchema.index({ id: 1 });

const Chunk=mongoose.model("Chunk",chunkSchema);
export default Chunk