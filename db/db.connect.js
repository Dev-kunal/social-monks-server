const mongoose=require('mongoose');

const initializeDBConnection=async ()=>{
try{
await mongoose.connect("mongodb+srv://kunaltijare:kunaltijarecluster@cluster0.i2ze7.mongodb.net/socailmediaDB?retryWrites=true&w=majority",{
  useNewUrlParser:true,
   useUnifiedTopology: true
})
console.log("Mongoose Connected Successfully");
}
catch(err){
  cosnole.log("Mongoose Connectin Failed",err)
}
}


module.exports=initializeDBConnection;