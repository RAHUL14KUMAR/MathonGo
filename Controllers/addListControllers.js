const listModal=require('../Schema/ListSchema');

// addmin can createList
const createList=async(req,res)=>{
    const { listTitle }=req.body;

    if(!listTitle){
        return res.status(400).json({message:'title is required'})
    }

    const lists=await listModal.findOne({title:listTitle});
    if(lists){
        return res.status(400).json({message:"send a unique listTitle string"})
    }

    const list=await listModal.create({
        title:listTitle
    })

    return res.status(200).json({message:'list is created successfully'})
}

module.exports={
    createList
}