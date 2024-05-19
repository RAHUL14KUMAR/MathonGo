const mongoose=require('mongoose');

const schema=mongoose.Schema

const listSchema=new schema({
    title:{
        type:String,
        required:true   
    },
    customProperties:[
        {
            type:mongoose.Schema.Types.ObjectId,ref:'users'
        }
    ]
})

module.exports=mongoose.model('lists',listSchema)