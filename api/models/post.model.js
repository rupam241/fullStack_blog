import mongoose from "mongoose";
const postSchema= new mongoose.Schema({
    userId:{
        type:String,
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    title:{
        type:String,
        require:true,
        unique:true,
    },
    image:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0JsvMgqFaoc2sETK_NJl89I58BkPgYLVLg&s",
    },
    category:{
        type:String,
        default:'uncategorized',
    },
    slug:{
        type:String,
        require:true,
        unique:true
    },
},{Timestamp:true})

const post=mongoose.model('post',postSchema)
export default post;