const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
   password: {
      type: String,
      required: true,
    },
    fullname:{
      type:String,
      required:true
    },
    bio:{
      type:String
    }
},
 {
    timestamps: true,
  }
)

const User=mongoose.model("User",UserSchema);

module.exports=User;