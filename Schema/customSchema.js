const mongoose=require('mongoose');

const schema=mongoose.Schema

const customSchema=new schema({
    title:{
        type:String,
        required:true
    },
    defaultValue:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('customs',customSchema)