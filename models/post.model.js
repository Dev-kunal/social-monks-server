const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
  userId:{type:mongoose.Types.ObjectId,ref:"User"},
  fileurl:{
       
       type: String
    },
  caption:{
    type:String
  }
},
{
    timestamps: true,
  }
)


const Post=mongoose.model("Post",PostSchema);

module.exports=Post