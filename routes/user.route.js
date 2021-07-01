const express=require('express');
const router=express.Router();
const User=require("../models/user.model");

router.route("/")
.get((req,res)=>{
  res.json({mesg:"Its working"})
})
.post(async(req,res)=>{
  try{
  console.log(req.body.user)
  const user=req.body.user;
  const Newuser=new User(user)
  const savedUser=await Newuser.save();
  res.json({success:true,savedUser})
  }catch(err){
    console.log(err)
  }
})


module.exports=router;