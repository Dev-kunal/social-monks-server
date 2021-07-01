const mongoose=require("mongoose");

const FollowinSchema=new mongoose.Schema({
userId:{type:mongoose.Types.ObjectId,ref:"User"},
followingId:{type:mongoose.Types.ObjectId,ref:"User"},
followStatus:{
  type:String,
  default:"Follow",
  enum:["Following","Not Following"]
},

})