const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    customProperty:[
        {
            type:mongoose.Schema.Types.ObjectId,ref:"customs"
        }
    ]
})

module.exports=mongoose.model("users",userSchema);